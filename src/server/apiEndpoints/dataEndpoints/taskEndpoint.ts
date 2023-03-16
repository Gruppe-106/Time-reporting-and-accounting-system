import EndpointBase, {User} from "../endpointBase";
import {Request, Response} from "express";
import {TASKS} from "../../database/fakeData/TASKS";

export interface TaskReturnType {
    id?: number,
    name?: string,
    startDate?: string,
    endDate?: string,
    timeType?: number
}

export class TaskEndpoint extends EndpointBase {
    table = TASKS.data;
    data: TaskReturnType[];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]):Promise<object[]> {
        return await this.baseGetData(requestValues, primaryKey, keyEqual);
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