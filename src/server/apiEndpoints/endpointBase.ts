import {Request, Response} from "express";
import AuthEndpoint, {AuthData} from "./dataGetEndpoints/authEndpoint";
import {Where} from "../database/mysqlHandler";
import {mysqlHandler} from "../../app";

abstract class EndpointBase {
    protected readonly mySQL = mysqlHandler;
    abstract requiredRole: number;

    /**
     * Ensures the user is authorised to access page or api
     * @param req Request: request object of the request
     * @protected
     * @return Boolean: whether the user is allowed
     */
    protected async ensureAuth(req: Request): Promise<boolean> {
        try {
            // Get authentication data
            let authData: AuthData = await new AuthEndpoint().getAuthentication(req);
            // If all users have access and the user has been authenticated return true
            if (this.requiredRole === 1 && authData.userId) return true;
            // Otherwise check if the role match or user is administrator
            let roles: boolean[] = authData.userRoles.map((value) => {
                return value.roleId === this.requiredRole || value.roleId === 4
            });
            return roles.indexOf(true) !== -1;
        } catch (e) { console.log(e) }
        return false;
    }

    protected createWhere(primaryKey: string, keyEqual: string[]): Where | undefined {
        if (keyEqual.indexOf("*") === -1) {
            return  {column: primaryKey, equals: keyEqual};
        }
    }

    /**
     * Sends bad request back to the request and ends connection
     * @param res Response: response object of the api request
     * @param req Request: Request object of the api request
     * @protected
     */
    protected badRequest(res: Response, req: Request) {
        if (!res.writableEnded) {
            if (req !== undefined) req.pause();
            res.status(400);
            res.end(JSON.stringify({message: "Bad Request"}));
        }
    }
}

export default EndpointBase;