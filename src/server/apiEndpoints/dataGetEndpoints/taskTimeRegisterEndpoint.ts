import GetEndpointBase, { PrimaryKeyType } from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Request, Response} from "express";

/**
 * Endpoint for .../api/time/register/get
 */
class TaskTimeRegisterEndpoint extends GetEndpointBase {
    urlPrimaryKey: PrimaryKeyType[];
    requiredRole: number = 1;

    allowedColumns: string[] = [
        "taskId",
        "taskName",
        "projectName",
        "projectId",
        "date",
        "userId",
        "time",
        "approved",
        "managerLogged",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let select: string[] = [];
        let join: string = "";

        // If a specific period is specified, use that to select data from MySQL
        let period: string = "";
        if (data !== undefined && data.length > 1) {
            period = ` AND (date BETWEEN '${this.mySQL.dateFormatter(parseInt(data[0]))}' AND '${this.mySQL.dateFormatter(parseInt(data[1]))}')`;
        }
        let allColumns: boolean = requestValues.indexOf("*") !== -1;

        //Find all columns to find in the database
        if (requestValues.indexOf("date")          !== -1 || allColumns) select.push("ttr.date");
        if (requestValues.indexOf("taskId")        !== -1 || allColumns) select.push("ttr.taskId");
        if (requestValues.indexOf("userId")        !== -1 || allColumns) select.push("ttr.userId");
        if (requestValues.indexOf("time")          !== -1 || allColumns) select.push("ttr.time");
        if (requestValues.indexOf("approved")      !== -1 || allColumns) select.push("ttr.approved");
        if (requestValues.indexOf("managerLogged") !== -1 || allColumns) select.push("ttr.managerLogged");
        if (requestValues.indexOf("taskName")      !== -1 || allColumns) {
            select.push("t.name as taskName");
            join += " CROSS JOIN TASKS t ON t.id=ttr.taskId";
        }
        if (requestValues.indexOf("projectName") !== -1 || requestValues.indexOf("projectId") !== -1|| allColumns) {
            join += " CROSS JOIN TASKS_PROJECTS_CONNECTOR tp ON ttr.taskId=tp.taskId CROSS JOIN PROJECTS p ON tp.projectId=p.id";
            if (requestValues.indexOf("projectId")   || allColumns) select.push("p.id as projectId");
            if (requestValues.indexOf("projectName") || allColumns) select.push("p.name as projectName");
        }

        //Query the data for all group that satisfies conditions
        let query: string = `SELECT ${select} FROM (SELECT * FROM USERS_TASKS_TIME_REGISTER ${this.mySQL.createWhereString(this.createWhere(primaryKey, keyEqual))} ${period}) ttr ${join}`;
        let response:MySQLResponse = await this.mySQL.sendQuery(query);

        // Convert date to a timestamp
        for (const result of response.results) {
            if (result.date) result.date = this.mySQL.dateToNumber(result.date);
        }

        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }

    public getRoute(req:Request, res:Response, primaryKey:string = "userId", requestKeysName:string = "user") {
        let requestKeys: string[] = this.urlParamsConversion(req.query[requestKeysName], false, true, res);
        if (requestKeys === undefined) { return this.badRequest(res, req); }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);
        let period: string[] = this.urlParamsConversion(req.query.period);

        this.processRequest(req, requestedValues, primaryKey, requestKeys, period).then((data) => {
            if (!res.writableEnded) {
                res.setHeader('Content-Type', 'application/json');
                res.status(data.status).json(data);
            }
        })
    };
}

export default TaskTimeRegisterEndpoint;