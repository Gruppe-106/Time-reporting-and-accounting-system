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
        "timeTypeName",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        //Get all projects that fulfill the given request
        let join: string = "";
        let getAll: boolean = requestValues.indexOf("*") !== -1;
        let columns: string = ``;
        if (requestValues.indexOf("timeTypeName") !== -1 || getAll) {
            join += ` JOIN TIMETYPES tt where tt.id=t.timeType`;
            columns += "tt.name"
        }
        if (getAll) {
            for (const value of this.allowedColumns) {
                if (value !== "timeTypeName" && value !== "*") {
                    if (columns !== "") columns += ",";
                    columns += `t.${value}`;
                }
            }
        } else {
            for (const value of requestValues) {
                if (value !== "timeTypeName") {
                    if (columns !== "") columns += ",";
                    columns += `t.${value}`;
                }
            }
        }
        let queryString: string = `SELECT ${columns} FROM (SELECT * FROM TASKS ${this.mySQL.createWhereString(this.createWhere(primaryKey, keyEqual))}) t ${join}`;

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