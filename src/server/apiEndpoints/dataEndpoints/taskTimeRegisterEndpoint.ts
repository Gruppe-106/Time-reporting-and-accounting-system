import EndpointBase from "../endpointBase";
import {Request, Response} from "express";
import {USER_TASK_TIME_REGISTER} from "../../database/fakeData/USER_TASK_TIME_REGISTER";
import {TaskEndpoint, TaskReturnType} from "./taskEndpoint";
import {TaskProjectEndpoint, TaskProjectReturnType} from "./taskProjectEndpoint";
import {UserEndpoint, UserReturnType} from "./userEndpoint";
import {RoleEndpoint, RoleReturnType} from "./roleEndpoint";

export interface TaskTimeRegisterReturnType {
    taskId?:        number,
    taskName?:      string,
    projectName?:   string,
    projectId?:     number,
    date?:          number,
    userId?:        number,
    time?:          number,
    approved?:      boolean,
    managerLogged?: boolean,
}

interface EntryType {
    date: number,
    taskId: number,
    userId: number,
    time: number,
    approved: boolean,
    managerLogged: boolean
}

export class TaskTimeRegisterEndpoint extends EndpointBase {
    table = USER_TASK_TIME_REGISTER.data;
    data: TaskTimeRegisterReturnType[];

    private async getAllDataForKey(dataIndex:number, entry:EntryType) {
        let task:        TaskReturnType[]        = await new TaskEndpoint(this.user).processRequest(["name"], "id", [entry.taskId.toString()]);
        let taskProject: TaskProjectReturnType[] = await new TaskProjectEndpoint(this.user).processRequest(["projectId", "projectName"], "taskId", [entry.taskId.toString()]);
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
    }

    private async getSpecificDataForKey(requestValues: string[], dataIndex:number, entry:EntryType) {
        let taskProject: TaskProjectReturnType[];
        let projectValues: string[] = [];
        if (requestValues.indexOf("projectName") !== -1) projectValues.push("projectName");
        if (requestValues.indexOf("projectId") !== -1)   projectValues.push("projectId");
        if (projectValues.length > 0) {
            taskProject = await new TaskProjectEndpoint(this.user).processRequest(projectValues, "taskId", [entry.taskId.toString()]);
        }

        for (const request of requestValues) {
            switch (request) {
                case "taskId":
                    this.data[dataIndex].taskId = entry.taskId;
                    break;
                case "taskName":
                    let task: TaskReturnType[] = await new TaskEndpoint(this.user).processRequest(["name"], "id", [entry.taskId.toString()]);
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

    async getData(requestValues: string[], primaryKey: string, keyEqual: string[]): Promise<object[]> {
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.table) {
            if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1) {
                this.data[dataIndex] = {};
                if (requestValues.indexOf("*") !== -1) {
                    await this.getAllDataForKey(dataIndex, entry);
                } else {
                    await this.getSpecificDataForKey(requestValues, dataIndex, entry);
                }
                dataIndex++;
            }
        }
        return this.data;
    }

    getRoute(req: Request, res: Response) {
        let requestKeys: string[] = this.urlParamsConversion(req.query.user, false, true, res);
        if (requestKeys === undefined) { return; }

        let data:string[];
        let periodsList: string[] = this.urlParamsConversion(req.query.user, false, true, res);
        if (periodsList !== undefined && periodsList.length > 1) {
            data = [periodsList[0], periodsList[1]];
        }

        //Not allowed to get all, so remove that from the list
        requestKeys = requestKeys.filter((value:string) => { if (value !== "*") return value});
        if (requestKeys.length === 0) { return this.badRequest(res); }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(requestedValues, "userId", requestKeys, data).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(data);
        })
    }
}