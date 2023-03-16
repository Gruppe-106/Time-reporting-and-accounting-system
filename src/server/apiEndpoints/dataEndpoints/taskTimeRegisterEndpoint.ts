import EndpointBase, {User} from "../endpointBase";
import {Request, Response} from "express";
import {USER_TASK_TIME_REGISTER} from "../../database/fakeData/USER_TASK_TIME_REGISTER";
import {TaskEndpoint, TaskReturnType} from "./taskEndpoint";
import {TaskProjectEndpoint, TaskProjectReturnType} from "./taskProjectEndpoint";

export interface TaskTimeRegisterReturnType {
    taskId?:        number,
    taskName?:      string, //
    projectName?:   string, //
    projectId?:     number  //
    date?:          number,
    userId?:        number,
    time?:          number
    approved?:      boolean
    managerLogged?: boolean
}

export class TaskTimeRegisterEndpoint extends EndpointBase {
    table = new USER_TASK_TIME_REGISTER().data;
    data: TaskTimeRegisterReturnType[];

    async getData(requestValues: string[], user: User, primaryKey: string, keyEqual: string[]): Promise<object[]> {
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.table) {
            if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1) {
                this.data[dataIndex] = {};
                if (requestValues.indexOf("*") !== -1) {
                    let task:        TaskReturnType[]        = await new TaskEndpoint(user).processRequest(["name"], "id", [entry.taskId.toString()]);
                    let taskProject: TaskProjectReturnType[] = await new TaskProjectEndpoint(user).processRequest(["projectId", "projectName"], "taskId", [entry.taskId.toString()]);
                    this.data[dataIndex] = {
                        taskId:        entry.taskId,
                        taskName:      task[0].name,
                        projectName:   taskProject[0].projectName,
                        projectId:     taskProject[0].projectId,
                        date:          entry.date,
                        userId:        entry.userId,
                        time:          entry.time,
                        approved:      entry.approved,
                        managerLogged: entry.managerLogged
                    }
                } else {
                    let taskProject: TaskProjectReturnType[];
                    let projectValues: string[] = [];
                    if (requestValues.indexOf("projectName") !== -1) projectValues.push("projectName");
                    if (requestValues.indexOf("projectId") !== -1)   projectValues.push("projectId");
                    if (projectValues.length > 0) {
                        taskProject = await new TaskProjectEndpoint(user).processRequest(projectValues, "taskId", [entry.taskId.toString()]);
                    }

                    for (const request of requestValues) {
                        switch (request) {
                            case "taskId":
                                this.data[dataIndex].taskId = entry.taskId;
                                break;
                            case "taskName":
                                let task: TaskReturnType[] = await new TaskEndpoint(user).processRequest(["name"], "id", [entry.taskId.toString()]);
                                this.data[dataIndex].taskName = task[0].name;
                                break;
                            case "projectName":
                                this.data[dataIndex].projectName = taskProject[0].projectName;
                                break;
                            case "projectId":
                                this.data[dataIndex].projectId = taskProject[0].projectId;
                                break;
                            case "date":
                                this.data[dataIndex].date = entry.date;
                                break;
                            case "userId":
                                this.data[dataIndex].userId = entry.userId;
                                break;
                            case "time":
                                this.data[dataIndex].time = entry.time;
                                break;
                            case "approved":
                                this.data[dataIndex].approved = entry.approved;
                                break;
                            case "managerLogged":
                                this.data[dataIndex].managerLogged = entry.managerLogged;
                                break;
                            default:
                                break;
                        }
                    }
                }
                dataIndex++;
            }
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
    let primaryKey:     string = "userId";

    if (typeof userIds === "string") {
        requestKeys= userIds.split(",");
    } else {
        return badRequest(res);
    }

    if (typeof values === "string" ) {
        requestedValues = values.split(",");
    } else {
        requestedValues = ["*"];
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