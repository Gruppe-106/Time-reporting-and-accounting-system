import EndpointBase, {User} from "../endpointBase";
import {Request, Response} from "express";
import {ROLES} from "../../database/fakeData/ROLES";

interface ReturnType {
    id?: number,
    name?: string,
}

export class RoleEndpoint extends EndpointBase {
    table = ROLES.data;
    data: ReturnType[];

    async getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]):Promise<object[]> {
        return await this.baseGetData(requestValues, user, primaryKey, keyEqual);
    }
}

export function roleGetRoute(req: Request, res: Response, user: User) {
    let ids = req.query.ids;

    let requestKeys: string[];

    if (typeof ids === "string") {
        requestKeys = ids.split(",");
    } else {
        res.sendStatus(400)
        res.end();
        return;
    }

    let roleEndpoint = new RoleEndpoint(user);
    roleEndpoint.processRequest(["*"], "id", requestKeys).then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);
    })
}