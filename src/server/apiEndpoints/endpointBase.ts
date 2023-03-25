import {Server} from "../server";
import {Request, Response} from "express";
import AuthEndpoint, {AuthData} from "./dataGetEndpoints/authEndpoint";

export interface User {
    authKey: string;
    id?:     number;
    role?:   Roles[];
}

enum Roles {
    NORMAL,
    MANAGER,
    PROJECT_MANAGER,
    ADMIN
}

abstract class EndpointBase {
    protected readonly mySQL = Server.mysql;
    abstract requiredRole: number;

    protected async ensureAuth(req: Request): Promise<boolean> {
        try {
            let authData: AuthData = await new AuthEndpoint().getAuthentication(req);
            if (this.requiredRole === 1 && authData.userId) return true;

            let roles: boolean[] = authData.userRoles.map((value) => { return value.roleId === this.requiredRole || value.roleId === Roles.ADMIN } );
            return roles.indexOf(true) !== -1;
        } catch (e) { }
        return false;
    }

    protected badRequest(res: Response) {
        res.sendStatus(400);
        res.end();
    }
}

export default EndpointBase;