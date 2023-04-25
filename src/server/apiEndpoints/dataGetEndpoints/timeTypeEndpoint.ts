import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

/**
 * Endpoint for .../api/role/get
 */
class TimeTypeEndpoint extends  GetEndpointBase {
    requiredRole: number = 1;

    allowedColumns: string[] = [
        "id",
        "name",
        "*"
    ];

    /**
     * Retrieves time-types from database
     * @param requestValues Columns to get data from
     * @param primaryKey The primary key to match
     * @param keyEqual What the primary key should match
     * @returns array of time-types optional id and name
     */
    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        //Get all time-types that fulfill the given request
        let response:MySQLResponse = await this.mySQL.select("TIMETYPES", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));
        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }

}

export default TimeTypeEndpoint;