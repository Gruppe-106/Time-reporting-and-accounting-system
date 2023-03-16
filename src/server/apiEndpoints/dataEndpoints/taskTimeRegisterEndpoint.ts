import {User} from "../endpointBase";
import {Request, Response} from "express";
import EndpointConnectorBase from "../endpointConnectorBase";
import {USER_TASK_TIME_REGISTER} from "../../database/fakeData/USER_TASK_TIME_REGISTER";
import {TASKS} from "../../database/fakeData/TASKS";
import {PROJECTS} from "../../database/fakeData/PROJECTS";

interface ReturnType {
    taskId?:        number,
    taskName?:      string,
    projectName?:   string,
    projectId?:     number
    date?:          number,
    userId?:        number,
    time?:          number
    approved?:      boolean
    managerLogged?: boolean
}

export class TaskTimeRegisterEndpoint extends EndpointConnectorBase {
    table           = new PROJECTS().data;
    tableSecond     = new TASKS().data;
    tableConnector  = new USER_TASK_TIME_REGISTER().data;

    data: ReturnType[];

    async getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[], data?:string[]): Promise<object[]> {
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.tableConnector) {
            if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1 || keyEqual.indexOf("*") !== -1) {
                this.data[dataIndex] = {};
                if (requestValues.indexOf("*") !== -1) {

                } else {
                    for (const request of requestValues) {
                    }
                }
            }
            dataIndex++;
        }
        return this.data;
    }
}

function badRequest(res: Response) {
    res.sendStatus(400)
    res.end();
}

export function taskTimeRegisterGetRoute(req:Request, res:Response, user:User) {
    let userIds = req.query.user;
    let periods = req.query.period;
    let values  = req.query.var;

    let requestedValues:string[];
    let requestKeys:    string[];
    let data:           string[];
    let primaryKey:     string = "";


    if (typeof values === "string" ) {
        requestedValues = values.split(",");
    } else {
        return badRequest(res);
    }

    if (typeof userIds === "string") {
        requestKeys= userIds.split(",");
        primaryKey = "user";
    } else {
        return badRequest(res);
    }

    if (typeof periods === "string") {
        let periodsList = periods.split(",");
        if (periodsList.length > 1) {
            data = [periodsList[0], periodsList[1]];
        }
    }

    let taskTimeRegisterEndpoint = new TaskTimeRegisterEndpoint(user);
    taskTimeRegisterEndpoint.processRequest(requestedValues, primaryKey, requestKeys, data).then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);
    })
}