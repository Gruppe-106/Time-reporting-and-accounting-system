import {Request, Response} from "express";
import {getCookies} from "../../utility/cookie";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Server} from "../../server";

interface AuthApi {
    authKey:        string,
    authKeyEndDate: string,
    userId:         number
}

interface RoleApi {
    roleId: number
}

export interface AuthData {
    success: boolean,
    userId: number,
    userRoles: RoleApi[]
}

class AuthEndpoint {
    public async getAuthentication(req: Request): Promise<AuthData> {
        let cookies: Map<string, string> = getCookies(req.headers.cookie);
        if (cookies.has("auth")) {
            let authKey: string = cookies.get("auth");
            let authResponse: MySQLResponse = await Server.mysql.select("AUTH", ["authKey", "authKeyEndDate", "userId"], {column: "authKey", equals: [authKey]});
            if (authResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");

            let auth: AuthApi = authResponse.results[0];

            if (authKey === auth.authKey) {
                if (Date.now() < Server.mysql.dateToNumber(new Date(auth.authKeyEndDate))) {
                    let roleResponse: MySQLResponse = await Server.mysql.select("USERS_ROLES_CONNECTOR", ["roleId"], {column: "userId", equals: [auth.userId.toString()]});
                    if (roleResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");
                    let roles:RoleApi[] = roleResponse.results;

                    return {success: true, userId: auth.userId, userRoles: roles};
                }
            }
            throw new Error("[Auth] Failed to authenticate token is either missing or expired")
        } else {
            throw new Error("[Auth] No auth cookie provided");
        }
    }

    public async getRoute(req:Request, res:Response): Promise<void> {
        res.setHeader('Content-Type', 'application/json');
        try {
            let data: AuthData = await this.getAuthentication(req);
            res.status(200).json({status: 200, data: data});
            return;
        } catch (e) {
            res.status(404).json({status: 404, data: {success: false}});
            return;
        }
    }
}

export default AuthEndpoint;