import GetEndpointBase, {PrimaryKeyType} from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import MysqlQueryBuilder, {MySQLJoinTypes} from "../../database/mysqlStringBuilder";

/**
 * Endpoint for .../api/task/get
 */
class TaskEndpoint extends  GetEndpointBase {
    requiredRole: number = 1;
    urlPrimaryKey: PrimaryKeyType[];

    allowedColumns: string[] = [
        "id",
        "name",
        "startDate",
        "endDate",
        "timeType",
        "timeTypeName"
    ];

    // List of columns in the base table and what key should be request for getting columns
    private baseColumns: {request: string, column: string}[] = [
        { request: "id",             column: "t.id as id" },
        { request: "name",           column: "t.name as name" },
        { request: "startDate",      column: "t.startDate as startDate" },
        { request: "endDate",        column: "t.endDate as endDate" },
        { request: "timeType",       column: "t.timeType as timeType" }
    ]

    /**
     * Gets data from DB and convert to client format
     * @param requestValues String[]: the values to request from the DB also known as columns
     * @param primaryKey String: The primary key to look for
     * @param keyEqual String[]?: Specific primary keys to look for if undefined get all aka *
     * @param data String[]?: Additional data needed for sending query
     * @return Promise object[] : containing the information to send to client
     */
    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        // Check if all columns are requested
        let allColumns: boolean = requestValues.indexOf("*") !== -1;

        // Check if specific primary keys are requested
        let where: [key: string, equals: string[]] = undefined;
        if (keyEqual !== undefined && allColumns)
            where = [primaryKey, keyEqual];

        // Build MySQL query
        let mysqlBuilder: MysqlQueryBuilder = new MysqlQueryBuilder().from("TASKS", where, undefined,"t");

        // Join with TIMETYPES table if timeTypeName is requested
        if (requestValues.indexOf("timeTypeName") !== -1 || allColumns) {
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "TIMETYPES", ["tt.id", "t.timeType"], "tt")
                .addColumnsToGet(["tt.name"]);
        }

        //Find all columns to find in the database
        this.baseColumns.forEach((value) => {
            if (requestValues.indexOf(value.request) !== -1 || allColumns) mysqlBuilder.addColumnsToGet([value.column]);
        });
    
        // Send MySQL query and convert dates to number format
        let response:MySQLResponse = await this.mySQL.sendQuery(mysqlBuilder.build());
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");
        for (let i = 0; i < response.results.length; i++) {
            if (response.results[i].startDate !== undefined) response.results[i].startDate = this.mySQL.dateToNumber(response.results[i].startDate);
            if (response.results[i].endDate !== undefined)   response.results[i].endDate   = this.mySQL.dateToNumber(response.results[i].endDate);
        }

        return response.results;
    }

}

export default TaskEndpoint;