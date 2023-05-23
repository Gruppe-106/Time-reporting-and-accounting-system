import GetEndpointBase, {PrimaryKeyType} from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import MysqlStringBuilder from "../../database/mysqlStringBuilder";
import MysqlQueryBuilder, {MySQLJoinTypes} from "../../database/mysqlStringBuilder";
import "../../utility/array";
/**
 * Endpoint for .../api/role/user/get
 */
class UserRoleEndpoint extends GetEndpointBase {
    urlPrimaryKey: PrimaryKeyType[] = [
        {urlKey: "user", mysqlKey: "userId", throwOnMissing: false, allowAll: false},
        {urlKey: "role", mysqlKey: "roleId", throwOnMissing: true,  allowAll: false}
    ];
    requiredRole: number = 1;

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        let allColumns: boolean = requestValues.contains("*");

        // Check if a where condition is needed
        let where: [key: string, equals: string[]] = undefined;
        if (keyEqual !== undefined && allColumns)
            where = [primaryKey, keyEqual];

        let mysqlBuilder: MysqlStringBuilder = new MysqlQueryBuilder()
            .from("USERS_ROLES_CONNECTOR", where, undefined, "ur");

        // Add all columns to find in the database
        if (requestValues.contains("userId") || allColumns) mysqlBuilder.addColumnsToGet(["ur.userId"]);
        if (requestValues.contains("roleId") || allColumns) mysqlBuilder.addColumnsToGet(["ur.roleId"]);
        // The 2 columns below has to be retrieved from a different table, so add a join statement to query
        if (requestValues.contains("firstName") || allColumns) {
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "USERS", ["u.id", "ur.userId"], "u");
            mysqlBuilder.addColumnsToGet(["u.firstName"]);
        }
        if (requestValues.contains("lastName") || allColumns) {
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "USERS", ["u.id", "ur.userId"], "u");
            mysqlBuilder.addColumnsToGet(["u.lastName"]);
        }
        if (requestValues.contains("roleName") || allColumns) {
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "ROLES", ["r.id", "ur.roleId"], "r");
            mysqlBuilder.addColumnsToGet(["r.name"]);
        }

        //Query the data for all group that satisfies conditions
        let response:MySQLResponse = await this.mySQL.sendQuery(mysqlBuilder.build());
        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }
}

export default UserRoleEndpoint;