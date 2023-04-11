import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

/**
 * Endpoint for .../api/time/register/get
 */
class TaskTimeRegisterEndpoint extends  GetEndpointBase {
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
        if (requestValues.indexOf("projectName") !== -1 || requestValues.indexOf("projectId") || allColumns) {
            join += " CROSS JOIN TASKS_PROJECTS_CONNECTOR tp ON ttr.taskId=tp.taskId CROSS JOIN PROJECTS p ON tp.projectId=p.id";
            if (requestValues.indexOf("projectId")   || allColumns) select.push("p.id as projectId");
            if (requestValues.indexOf("projectName") || allColumns) select.push("p.name as projectName");
        }

        //Query the data for all group that satisfies conditions
        let query: string = `SELECT ${select} FROM (SELECT * FROM USERS_TASKS_TIME_REGISTER ${this.mySQL.createWhereString(this.createWhere(primaryKey, keyEqual))}) ttr ${join}`;
        let response:MySQLResponse = await this.mySQL.sendQuery(query);

        // Convert date to a timestamp
        for (const result of response.results) {
            if (result.date) result.date = this.mySQL.dateToNumber(result.date);
        }

        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }
}

export default TaskTimeRegisterEndpoint;