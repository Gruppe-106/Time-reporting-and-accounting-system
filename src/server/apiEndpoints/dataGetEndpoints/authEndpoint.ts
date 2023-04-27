import {Request, Response} from "express";
import {getCookies} from "../../utility/cookie";
import {MySQLResponse} from "../../database/mysqlHandler";
import {mysqlHandler} from "../../../app";

/**
 * Structure of data retrieved from database
 */
interface AuthApi {
    authKey:        string,
    authKeyEndDate: string,
    userId:         number
}

interface RoleApi {
    roleId: number
}

/**
 * Structure of data send to client if successful
 */
export interface AuthData {
    success: boolean,
    userId: number,
    userRoles: RoleApi[]
}

class AuthEndpoint {
    /**
     * Retrieves authentication data from database and checks it's validity
     * @param req Request object
     * @returns Promise resolving to authentication data and user role(s)
     * @throws Error if authentication fails
     */
    public async getAuthentication(req: Request): Promise<AuthData> {
        // Get cookies from request headers
        let cookies: Map<string, string> = getCookies(req.headers.cookie);
        // Get auth key from cookies
        let authKey = cookies.get("auth");
        // Throw error if no auth key is provided
        if (!authKey) {
            throw new Error("[Auth] No auth cookie provided");
        }

        let query: string = `SELECT authKey,authKeyEndDate,userId FROM AUTH WHERE authKey='${authKey}' AND authKeyEndDate >= NOW()`;
        // Retrieve authentication data from database
        let authResponse: MySQLResponse = await mysqlHandler.sendQuery(query);
        // Throw error if data retrieval fails
        if (authResponse.error !== null) {
            throw new Error("[MySQL] Failed to retrieve data");
        }

        // Throw error if auth key is invalid
        if (authResponse.results.length === 0) {
            throw new Error("[Auth] Failed to authenticate token is either missing or expired");
        }

        // Get authentication data from response
        let auth: AuthApi = authResponse.results[0];

        // Retrieve user roles from database
        let roleResponse: MySQLResponse = await mysqlHandler.select("USERS_ROLES_CONNECTOR", ["roleId"], {column: "userId", equals: [auth.userId.toString()]});

        // If roles are retrieved successfully, set roles to the results, otherwise set roles to an array with a single invalid role
        let roles: RoleApi[] = [{roleId: -1}];
        if (roleResponse.error === null)
            roles = roleResponse.results;

        // Return authentication data
        return {success: true, userId: auth.userId, userRoles: roles};

    }


    /**
     * Handles authentication route & sends authentication data to client including their role if successful
     * @param req Request object
     * @param res Response object
     * @returns Promise resolving to void
     */
    public async getRoute(req:Request, res:Response): Promise<void> {
        // Check if response is writable aka is there still a connection to write to
        if (!res.writableEnded) {
            // Set response header
            res.setHeader('Content-Type', 'application/json');
            try {
                // Get authentication data
                let data: AuthData = await this.getAuthentication(req);
                // Send success response with data
                res.status(200).json({status: 200, data: data});
            } catch (e) {
                // Send error response
                res.status(404).json({status: 404, data: {success: false}});
            }
        }

    }
}

export default AuthEndpoint;
