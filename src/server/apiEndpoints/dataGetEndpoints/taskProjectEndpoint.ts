import GetEndpointBase, {PrimaryKeyType} from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import MysqlQueryBuilder, {MySQLJoinTypes} from "../../database/mysqlStringBuilder";

/**
 * Endpoint for .../api/task/project/get
 */
class TaskProjectEndpoint extends GetEndpointBase {
    urlPrimaryKey: PrimaryKeyType[] = [
        {urlKey: "task",    mysqlKey: "taskId",    allowAll: false, throwOnMissing: false},
        {urlKey: "project", mysqlKey: "projectId", allowAll: false, throwOnMissing: true }
    ];
    requiredRole: number = 1;

    allowedColumns: string[] = [
        "taskId",
        "taskName",
        "projectId",
        "projectName",
        "*"
    ];

    /**
     * Retrieves task and project id and name from TASKS_PROJECTS_CONNECTOR
     * @param requestValues Columns to get data from
     * @param primaryKey The primary key to match
     * @param keyEqual What the primary key should match
     * @returns array of objects containing project task connections and optional names
     */
    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        let allColumns: boolean = requestValues.indexOf("*") !== -1;

        // Create condition for where table, undefined means all rows
        let where: [key: string, equals: string[]] = undefined;
        if (keyEqual !== undefined && allColumns)
            where = [primaryKey, keyEqual];

        // Create the MysqlQueryBuilder and add base table TASKS_PROJECTS_CONNECTOR
        let mysqlBuilder: MysqlQueryBuilder = new MysqlQueryBuilder()
            .from("TASKS_PROJECTS_CONNECTOR", where, undefined, "tp");

        // Add all requested columns
        if (requestValues.indexOf("taskId")    !== -1 || allColumns) mysqlBuilder.addColumnsToGet(["tp.taskId"]);
        if (requestValues.indexOf("projectId") !== -1 || allColumns) mysqlBuilder.addColumnsToGet(["tp.projectId"]);
        // The 2 columns below has to be retrieved from a different table, so add a join statement to query
        if (requestValues.indexOf("taskName")  !== -1 || allColumns) {
            mysqlBuilder.addColumnsToGet(["t.name as taskName"]);
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "TASKS", ["tp.taskId", "t.id"], "t")
        }
        if (requestValues.indexOf("projectName") !== -1 || allColumns) {
            mysqlBuilder.addColumnsToGet(["p.name as projectName"]);
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "PROJECTS", ["tp.projectId", "p.id"], "p")
        }

        // Build query and retrieve data for all task-project connection that satisfies conditions
        let response:MySQLResponse = await this.mySQL.sendQuery(mysqlBuilder.build());
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }
}

export default TaskProjectEndpoint;