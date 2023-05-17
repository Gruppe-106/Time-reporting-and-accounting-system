import GetEndpointBase, { PrimaryKeyType } from "../getEndpointBase";
import { MySQLResponse } from "../../database/mysqlHandler";

class UserDeleteEndpoint extends GetEndpointBase {
    urlPrimaryKey: PrimaryKeyType[] = [
        {urlKey: "user", mysqlKey: "id", allowAll: false, throwOnMissing: true}
    ];
    requiredRole: number = 4;

    /**
     * Deletes one or more users from the database
     * @param requestValues Isn't used!
     * @param primaryKey Isn't used!
     * @param keyEqual User(s) id(s) to delete
     */
    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        let response: MySQLResponse = await this.mySQL.remove("USERS", [{
            column: "id", equals: keyEqual // Pass the first element of the array
        }]);
        if (response.error !== null) {
            return Promise.resolve([{ error: "Failed to delete user" }])
        }

        return Promise.resolve([{ success: "User deleted successfully" }]);
    }
}


export default UserDeleteEndpoint;