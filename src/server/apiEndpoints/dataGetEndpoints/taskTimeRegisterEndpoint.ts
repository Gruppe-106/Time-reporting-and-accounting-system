import GetEndpointBase, {PrimaryKeyType} from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import MysqlStringBuilder from "../../database/mysqlStringBuilder";
import MysqlQueryBuilder, {MySQLJoinTypes} from "../../database/mysqlStringBuilder";

/**
 * Endpoint for .../api/time/register/get
 */
class TaskTimeRegisterEndpoint extends GetEndpointBase {
    urlPrimaryKey: PrimaryKeyType[] = [
        { urlKey: "user", mysqlKey: "userId", throwOnMissing: true, allowAll: true }
    ];
    dataKey: PrimaryKeyType = {
        urlKey: "period", mysqlKey: "", throwOnMissing: false
    };

    requiredRole: number = 1;

    // List of columns in the base table and what key should be request for getting columns
    private baseColumns: {request: string, column: string}[] = [
        { request: "date",          column: "ttr.date" },
        { request: "taskId",        column: "ttr.taskId" },
        { request: "userId",        column: "ttr.userId" },
        { request: "time",          column: "ttr.time" },
        { request: "approved",      column: "ttr.approved" },
        { request: "managerLogged", column: "ttr.managerLogged" }
    ]

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let allColumns: boolean = requestValues.indexOf("*") !== -1;

        let mysqlBuilder: MysqlStringBuilder = new MysqlQueryBuilder();

        // Check if a where condition is needed
        let where: string = undefined;
        if (keyEqual !== undefined && allColumns)
            where = mysqlBuilder.where([primaryKey, keyEqual]);

        // If a specific period is specified, add that to where string
        if (data !== undefined && data.length > 1)
            where = mysqlBuilder.whereDates(["date", this.mySQL.dateFormatter(parseInt(data[0])), this.mySQL.dateFormatter(parseInt(data[1]))], where);

        // Add base table to builder
        mysqlBuilder.from("USERS_TASKS_TIME_REGISTER", undefined, where, "ttr");

        //Find all columns to find in the database
        this.baseColumns.forEach((value) => {
            if (requestValues.indexOf(value.request) !== -1 || allColumns) mysqlBuilder.addColumnsToGet([value.column]);
        });

        if (requestValues.indexOf("taskName") !== -1 || allColumns) {
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "TASKS", ["t.id", "ttr.taskId"], "t");
            mysqlBuilder.addColumnsToGet(["t.name as taskName"]);
        }

        if (requestValues.indexOf("projectName") !== -1 || requestValues.indexOf("projectId") !== -1|| allColumns) {
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "TASKS_PROJECTS_CONNECTOR", ["ttr.taskId", "tp.taskId"], "tp");
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "PROJECTS", ["tp.projectId", "p.id"], "p");
            if (requestValues.indexOf("projectId")   || allColumns) mysqlBuilder.addColumnsToGet(["p.id as projectId"]);
            if (requestValues.indexOf("projectName") || allColumns) mysqlBuilder.addColumnsToGet(["p.name as projectName"]);
        }

        //Query the data for all group that satisfies conditions
        let response:MySQLResponse = await this.mySQL.sendQuery(mysqlBuilder.build());

        // Convert date to a timestamp
        for (const result of response.results) {
            if (result.date) result.date = this.mySQL.dateToNumber(result.date);
        }

        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }
}

export default TaskTimeRegisterEndpoint;