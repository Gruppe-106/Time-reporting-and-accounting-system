import GetEndpointBase, {PrimaryKeyType} from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

/**
 * Endpoint for .../api/role/get
 */
class RoleEndpoint extends  GetEndpointBase {
    requiredRole: number = 1;
    urlPrimaryKey: PrimaryKeyType[];

    allowedColumns: string[] = [
        "id",
        "name",
        "*"
    ];

    /**
     * Retrieves data from ROLES table in database
     * @param requestValues Columns to get data from
     * @param primaryKey The primary key to match
     * @param keyEqual What the primary key should match
     * @returns array of objects containing manager group data, see ManagerGroupReturnType for details
     */
    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        //Get all roles that fulfill the given request
        let response:MySQLResponse = await this.mySQL.select("ROLES", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));
        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }

}

export default RoleEndpoint;