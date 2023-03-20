import EndpointBase from "../endpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Request, Response} from "express";

/**
 * Endpoint for .../api/task/project/get
 */
class TaskProjectEndpoint extends  EndpointBase {
    allowedColumns: string[] = [
        "taskId",
        "taskName",
        "projectId",
        "projectName",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let select: string[] = [];
        let join: string = "";

        if (requestValues.indexOf("taskId")    !== -1 || requestValues.indexOf("*") !== -1) select.push("tp.taskId");
        if (requestValues.indexOf("projectId") !== -1 || requestValues.indexOf("*") !== -1) select.push("tp.projectId");
        if (requestValues.indexOf("taskName")  !== -1 || requestValues.indexOf("*") !== -1) {
            select.push("t.name as taskName");
            join += " CROSS JOIN tasks t ON tp.taskId=t.id";
        }
        if (requestValues.indexOf("projectName") !== -1 || requestValues.indexOf("*") !== -1) {
            select.push("p.name as projectName");
            join += " CROSS JOIN projects p ON tp.projectId=p.id";
        }

        let query: string = `SELECT ${select} FROM (SELECT * FROM tasks_projects_connector ${this.mySQL.createWhereString(this.createWhere(primaryKey, keyEqual))}) tp ${join}`;

        let response:MySQLResponse = await this.mySQL.sendQuery(query);

        if (response.error !== null) return [{error: "Failed to retrieve data"}];

        return response.results;
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
            res.status(data.status).json(data);
        })
    }
}

export default TaskProjectEndpoint;