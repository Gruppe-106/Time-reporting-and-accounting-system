import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

/**
 * Endpoint for .../api/task/get
 */
class TaskEndpoint extends  GetEndpointBase {
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
        let response:MySQLResponse = await this.mySQL.select("tasks", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));

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