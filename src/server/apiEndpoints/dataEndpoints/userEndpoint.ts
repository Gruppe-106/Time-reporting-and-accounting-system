import EndpointBase, {User} from "../endpointBase";
import {USERS} from "../../database/fakeData/USERS";
import {Request, Response} from "express";

export interface UserReturnType {
    id?: number,
    email?: string,
    firstName?: string,
    lastName?: string,
    group?: number
}

export class UserEndpoint extends EndpointBase {
    table = USERS.data;
    data: UserReturnType[];

    getRoute(req: Request, res: Response) {
        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        let primaryKey:string = "id";
        let requestKeys: string[] = this.urlParamsConversion(req.query.ids, false);
        if (requestKeys === undefined) {
            requestKeys = this.urlParamsConversion(req.query.emails, false, true, res);
            if (requestKeys === undefined) { return; }
            primaryKey = "email";
        }

        this.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(data);
        })
    }
}