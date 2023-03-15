import EndpointBase, {User} from "../endpointBase";
import {Request, Response} from "express";
import {TIMETYPE} from "../../database/fakeData/TIMETYPE";

interface ReturnType {
    id?: number,
    name?: string,
}

export class TimeTypeEndpoint extends EndpointBase {
    table = new TIMETYPE().data;
    data: ReturnType[];

    getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]): object {
        return this.baseGetData(requestValues, user, primaryKey, keyEqual);
    }
}

export function timeTypeGetRoute(req: Request, res: Response, user: User) {
    let ids = req.query.ids;

    let requestKeys: string[];

    if (typeof ids === "string") {
        requestKeys = ids.split(",");
    } else {
        res.sendStatus(400)
        res.end();
        return;
    }

    let timeTypeEndpoint = new TimeTypeEndpoint(user);
    timeTypeEndpoint.processRequest(["*"], "id", requestKeys).then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);
    })
}