import EndpointBase, {User} from "../endpointBase";
import {PROJECTS} from "../../database/fakeData/PROJECTS";
import {Request, Response} from "express";

interface ReturnType {
    id?: number,
    super_project?: number,
    name?: string,
    start_date?: string,
    end_date?: string
}

export class ProjectEndpoint extends EndpointBase{
    table = new PROJECTS().data;
    data: ReturnType[];

    getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]): object {
        return this.baseGetData(requestValues, user, primaryKey, keyEqual);
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