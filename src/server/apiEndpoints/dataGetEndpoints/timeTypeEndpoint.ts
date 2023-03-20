import EndpointBase from "../endpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

/**
 * Endpoint for .../api/role/get
 */
class TimeTypeEndpoint extends  EndpointBase {
    allowedColumns: string[] = [
        "id",
        "name",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let response:MySQLResponse = await this.mySQL.select("timetypes", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));
        if (response.error !== null) return [{error: "Failed to retrieve data"}];

        return response.results;
    }
}

export default TimeTypeEndpoint;