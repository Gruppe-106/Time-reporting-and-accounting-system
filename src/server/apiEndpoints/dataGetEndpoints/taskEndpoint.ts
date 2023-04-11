import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

/**
 * Endpoint for .../api/task/get
 */
class TaskEndpoint extends  GetEndpointBase {
    requiredRole: number = 1;

    allowedColumns: string[] = [
        "id",
        "name",
        "startDate",
        "endDate",
        "timeType",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        //Get all projects that fulfill the given request
        let join: string = "";
        let columns: string = `${this.createColumns(requestValues)}`;
        if (requestValues.indexOf("timeTypeName") !== -1) {
            join += ` JOIN TIMETYPES tt where tt.id=t.timeType`;
            columns += ",tt.name"
        }
        let queryString: string = `SELECT ${columns} FROM TASKS t ${this.mySQL.createWhereString(this.createWhere(primaryKey, keyEqual))} ${join}`;

        let response:MySQLResponse = await this.mySQL.sendQuery(queryString);

        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        //Convert dates to number format
        for (const result of response.results) {
            if (result.startDate) result.startDate = this.mySQL.dateToNumber(result.startDate);
            if (result.endDate)   result.endDate   = this.mySQL.dateToNumber(result.endDate);
        }

        return response.results;
    }
}

export default TaskEndpoint;