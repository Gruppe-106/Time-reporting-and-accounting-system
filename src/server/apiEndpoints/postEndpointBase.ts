import {Request, Response} from "express";
import {Server} from "../server";

export interface User {
    authKey: string;
    id?: number;
    role?: Roles;
}

enum Roles {
    NORMAL,
    MANAGER,
    PROJECT_MANAGER,
    ADMIN
}

abstract class GetEndpointBase {
    protected readonly user: User;
    protected readonly mySQL = Server.mysql;

    constructor(user: User) {
        this.user = user;
    }

    //Needs to actually be implemented
    private ensureAuth():boolean {
        return this.user.authKey === "test";
    }

    abstract submitData(req:Request, res:Response): Promise<string[]>;

    public async processRequest(req:Request, res:Response):Promise<{status:number, data: object}> {
        try {
            if (this.ensureAuth()) {
                let message: string[] = await this.submitData(req, res);
                if (message[0] !== "success") {
                    return {status: 404, data: {success: "false", reasons: message}};
                }
                return {status: 200, data: {success: "true"}};
            }
            return {status: 401, data: {error: "Not authorized"}};
        } catch (e) {
            console.error(e);
            return {status: 404, data: {error: "Failed to submit data"}};
        }
    }

    protected badRequest(res: Response) {
        res.sendStatus(400);
        res.end();
    }

    public postRoute(req: Request, res: Response) {
        this.processRequest(req, res).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(data.status).json(data);
        })
    };
}

export default GetEndpointBase;