import GetEndpointBase, { PrimaryKeyType } from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

/**
 * Endpoint for .../api/role/get
 */
class UserEndpoint extends GetEndpointBase {
    urlPrimaryKey: PrimaryKeyType[] = [
        {urlKey: "ids", mysqlKey: "id", allowAll: false},
        {urlKey: "emails", mysqlKey: "email", allowAll: false, throwOnMissing: true}
    ];
    requiredRole: number = 1;

    allowedColumns: string[] = [
        "id",
        "email",
        "firstName",
        "lastName",
        "groupId",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let response:MySQLResponse = await this.mySQL.select("USERS", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }
}

export default UserEndpoint;