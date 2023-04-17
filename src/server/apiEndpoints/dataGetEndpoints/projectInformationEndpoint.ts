import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

interface ProjectTaskResponse {
    taskId: number,
    projectId: number
}

/*
 * Endpoint for .../api/task/user/get
 */
class ProjectInformationEndpoint extends GetEndpointBase {
    allowedColumns: string[] = [
        "taskId",
        "userId",
        "*"
    ];
    requiredRole: number = 1;

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        if (keyEqual.length > 1) {
            keyEqual = [keyEqual[0]];
        }

        let projectTaskResponse: MySQLResponse = await this.mySQL.select("TASKS_PROJECTS_CONNECTOR", ["taskId"], {column: "projectId", equals: keyEqual});
        if (projectTaskResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        let projectTaskData: ProjectTaskResponse[] = projectTaskResponse.results;

        let taskIds:string[] = []
        for (const value of projectTaskData) {
            taskIds.push(value.taskId.toString());
        }

        let join: string = "";
        join += " CROSS JOIN USERS u ON u.id=ut.userId";
        let userTaskResponse: MySQLResponse = await this.mySQL.sendQuery(`SELECT ut.taskId,u.id,u.firstName,u.lastName FROM (SELECT * FROM USERS_TASKS_CONNECTOR ${this.mySQL.createWhereString({
            column: "taskId",
            equals: taskIds
        })}) ut ${join}`);
        if (userTaskResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return userTaskResponse.results;
    }
}

export default ProjectInformationEndpoint;