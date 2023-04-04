import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Request, Response} from "express";

/**
 * Endpoint for .../api/task/user/get
 */
class UserTaskEndpoint extends  GetEndpointBase {
    allowedColumns: string[] = [
        "taskId",
        "userId",
        "*"
    ];
    requiredRole: number = 1;

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let userTaskResponse: MySQLResponse = await this.mySQL.select("USERS_TASKS_CONNECTOR", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));
        if (userTaskResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");
        return userTaskResponse.results;
    }
}

export default UserTaskEndpoint;