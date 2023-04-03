import {Server} from "../server";
import {Request, Response} from "express";
import AuthEndpoint, {AuthData} from "./dataGetEndpoints/authEndpoint";

abstract class EndpointBase {
    protected readonly mySQL = Server.mysql;
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
            console.log(roles, authData.userRoles);
            return roles.indexOf(true) !== -1;
        } catch (e) { }
        return false;
    }

    /**
     * Sends bad request back to the request and ends connection
     * @param res Response: response object of the api request
     * @protected
     */
    protected badRequest(res: Response) {
        res.sendStatus(400);
        res.end();
    }
}

export default EndpointBase;