import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Request, Response} from "express";

/**
 * Endpoint for .../api/task/project/get
 */
class TaskProjectEndpoint extends  GetEndpointBase {
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

        let allColumns: boolean = requestValues.indexOf("*") !== -1;

        //Find all columns to find in the database
        if (requestValues.indexOf("taskId")    !== -1 || allColumns) select.push("tp.taskId");
        if (requestValues.indexOf("projectId") !== -1 || allColumns) select.push("tp.projectId");
        // The 2 columns below has to be retrieved from a different table, so add a join statement to query
        if (requestValues.indexOf("taskName")  !== -1 || allColumns) {
            select.push("t.name as taskName");
            join += " CROSS JOIN tasks t ON tp.taskId=t.id";
        }
        if (requestValues.indexOf("projectName") !== -1 || allColumns) {
            select.push("p.name as projectName");
            join += " CROSS JOIN projects p ON tp.projectId=p.id";
        }

        //Query the data for all group that satisfies conditions
        let query: string = `SELECT ${select} FROM (SELECT * FROM tasks_projects_connector ${this.mySQL.createWhereString(this.createWhere(primaryKey, keyEqual))}) tp ${join}`;
        let response:MySQLResponse = await this.mySQL.sendQuery(query);
        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }

    getRoute(req: Request, res: Response) {
        //Check if tasks where specified
        let primaryKey:string = "taskId";
        let requestKeys: string[] = this.urlParamsConversion(req.query.task, false);

        if (requestKeys === undefined) {
            //If not try projects
            requestKeys = this.urlParamsConversion(req.query.project, false, true, res);
            //If not return and send bad request
            if (requestKeys === undefined) { return this.badRequest(res); }
            primaryKey  = "projectId";
        }

        //Not allowed to get all, so remove that from the list
        requestKeys = requestKeys.filter((value:string) => { if (value !== "*") return value});
        if (requestKeys.length === 0) { return this.badRequest(res); }

        //Get vars if any otherwise it will get all
        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(data.status).json(data);
        })
    }
}

export default TaskProjectEndpoint;