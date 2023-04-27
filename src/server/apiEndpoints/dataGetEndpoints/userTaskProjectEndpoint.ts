import getEndpointBase, { PrimaryKeyType } from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

class UserTaskProjectEndpoint extends getEndpointBase {
    urlPrimaryKey: PrimaryKeyType[] = [
        {urlKey: "user", mysqlKey: "userId", allowAll: false, throwOnMissing: true}
    ];
    requiredRole: number = 1;

    /**
     * Retrieves all projects and tasks for a user.
     * This function isn't dynamic and will get all data for a single user
     * @param requestValues Columns to get data from
     * @param primaryKey The primary key to match
     * @param keyEqual What the primary key should match
     * @returns array of objects containing project task data for user
     */
    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        // Base query
        let query: string = `SELECT t.name AS taskName,t.id AS taskId,p.id AS projectId,p.name AS projectName  FROM (SELECT * FROM USERS_TASKS_CONNECTOR WHERE userId IN ('${keyEqual[0]}')) utc`;

        // Add joined tables to query
        query += ` CROSS JOIN TASKS t ON t.id=utc.taskId`;
        query += ` CROSS JOIN TASKS_PROJECTS_CONNECTOR tpc ON tpc.taskId=utc.taskId`;
        query += ` CROSS JOIN PROJECTS p ON p.id=tpc.projectId`;

        // Get data from database, throw if an error occurred
        let response: MySQLResponse = await this.mySQL.sendQuery(query);
        if (response.error !== null) throw new Error("Failed to load data");
        return Promise.resolve(response.results);
    }
}

export default UserTaskProjectEndpoint;