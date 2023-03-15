import EndpointBase, {User} from "../endpointBase";
import {USERS} from "../../database/fakeData/USERS";
import {Request, Response} from "express";

interface ReturnType {
    id?: number,
    email?: string,
    first_name?: string,
    last_name?: string,
    group?: number
}

export class UserEndpoint extends EndpointBase {
    table = new USERS().data;
    data: ReturnType[];

    getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]): object {
        return this.baseGetData(requestValues, user, primaryKey, keyEqual);
    }
}

export function userGetRoute(req:Request, res:Response, user:User) {
    let ids = req.query.ids;
    let emails = req.query.emails;
    let values = req.query.var;

    let requestedValues:string[];
    if (typeof values === "string" ) {
        requestedValues = values.split(",");
    } else {
        requestedValues = ["*"];
    }

    let primaryKey:string = "";
    let requestKeys: string[];

    if (typeof ids === "string") {
        requestKeys= ids.split(",");
        primaryKey = "id";
    } else if (typeof emails === "string") {
        requestKeys= emails.split(",");
        primaryKey = "email";
    }

    if (primaryKey === "") {
        res.sendStatus(400)
        res.end();
        return;
    }

    let userEndpoint = new UserEndpoint(user);
    userEndpoint.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);
    })
}