import EndpointBase, {User} from "../endpointBase";
import {Request, Response} from "express";
import {TASK_PROJECTS_CONNECTOR} from "../../database/fakeData/TASK_PROJECTS_CONNECTOR";
import {ProjectEndpoint, ProjectReturnType} from "./projectEndpoint";
import {TaskEndpoint, TaskReturnType} from "./taskEndpoint";

export interface TaskProjectReturnType {
    taskId?:      number,
    taskName?:    string,
    projectId?:   number,
    projectName?: string
}

interface EntryType {
    taskId: number,
    projectId: number
}

export class TaskProjectEndpoint extends EndpointBase {
    table = TASK_PROJECTS_CONNECTOR.data;
    data: TaskProjectReturnType[];

    private async getAllDataForKey(dataIndex:number, entry:EntryType) {
        let projectName: ProjectReturnType[] = await new ProjectEndpoint(this.user).processRequest(["name"], "id", [entry.projectId.toString()]);
        let taskName:    TaskReturnType[]    = await new TaskEndpoint(this.user).processRequest(["name"], "id", [entry.taskId.toString()]);
        this.data[dataIndex] = {
            taskId:      entry.taskId,
            taskName:    taskName[0].name,
            projectId:   entry.projectId,
            projectName: projectName[0].name
        }
    }

    private async getSpecificDataForKey(requestValues: string[], dataIndex:number, entry:EntryType) {
        for (const request of requestValues) {
            switch (request) {
                case "taskId":
                    this.data[dataIndex].taskId = entry.taskId;
                    break;
                case "taskName":
                    let taskName: TaskReturnType[] = await new TaskEndpoint(this.user).processRequest(["name"], "id", [entry.taskId.toString()]);
                    this.data[dataIndex].taskName  = taskName[0].name;
                    break;
                case "projectId":
                    this.data[dataIndex].projectId = entry.projectId;
                    break;
                case "projectName":
                    let projectName: TaskReturnType[] = await new ProjectEndpoint(this.user).processRequest(["name"], "id", [entry.projectId.toString()]);
                    this.data[dataIndex].projectName  = projectName[0].name;
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
        let primaryKey:string = "taskId";
        let requestKeys: string[] = this.urlParamsConversion(req.query.task, false);

        if (requestKeys === undefined) {
            requestKeys = this.urlParamsConversion(req.query.project, false, true, res);
            if (requestKeys === undefined) { return; }
            primaryKey  = "projectId";
        }

        //Not allowed to get all, so remove that from the list
        requestKeys = requestKeys.filter((value:string) => { if (value !== "*") return value});
        if (requestKeys.length === 0) { return this.badRequest(res); }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(data);
        })
    }
}
