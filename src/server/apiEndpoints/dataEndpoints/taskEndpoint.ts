import EndpointBase, {User} from "../endpointBase";
import {Request, Response} from "express";
import {TASKS} from "../../database/fakeData/TASKS";

interface ReturnType {
    id?: number,
    name?: string,
    start_date?: string,
    end_date?: string,
    time_type?: number
}

export class TaskEndpoint extends EndpointBase {
    table = new TASKS().data;
    data: ReturnType[];

    async getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]):Promise<object[]> {
        return await this.baseGetData(requestValues, user, primaryKey, keyEqual);
    }
}

export function taskGetRoute(req: Request, res: Response, user: User) {
    let ids = req.query.ids;
    let values = req.query.var;

    let requestedValues: string[];
    if (typeof values === "string") {
        requestedValues = values.split(",");
    } else {
        requestedValues = ["*"];
    }

    let requestKeys: string[];

    if (typeof ids === "string") {
        requestKeys = ids.split(",");
    } else {
        res.sendStatus(400)
        res.end();
        return;
    }

    let taskEndpoint = new TaskEndpoint(user);
    taskEndpoint.processRequest(requestedValues, "id", requestKeys).then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);
    })
}