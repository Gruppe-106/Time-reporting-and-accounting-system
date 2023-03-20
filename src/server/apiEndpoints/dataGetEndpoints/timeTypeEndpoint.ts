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
        //Get all timetypes that fulfill the given request
        let response:MySQLResponse = await this.mySQL.select("timetypes", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));
        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }
}

export default TimeTypeEndpoint;