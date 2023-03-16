import EndpointBase, {User} from "../endpointBase";
import {PROJECTS} from "../../database/fakeData/PROJECTS";
import {Request, Response} from "express";

export interface ProjectReturnType {
    id?: number,
    superProject?: number,
    name?: string,
    startDate?: string,
    endDate?: string
}

export class ProjectEndpoint extends EndpointBase{
    table = PROJECTS.data;
    data: ProjectReturnType[];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]):Promise<object[]> {
        return await this.baseGetData(requestValues, primaryKey, keyEqual);
    }
}


export function projectGetRoute(req:Request, res:Response, user:User) {
    let ids = req.query.ids;
    let values = req.query.var;

    let requestedValues:string[];
    if (typeof values === "string" ) {
        requestedValues = values.split(",");
    } else {
        requestedValues = ["*"];
    }

    if (ids === undefined || typeof ids !== "string") {
        res.sendStatus(400)
        res.end();
        return;
    }
    let idList: string[] = ids.split(",");

    let projectEndpoint = new ProjectEndpoint(user);
    projectEndpoint.processRequest(requestedValues, "id", idList).then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);
    })
}