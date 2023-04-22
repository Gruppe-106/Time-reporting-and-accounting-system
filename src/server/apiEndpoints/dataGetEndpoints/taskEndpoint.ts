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

        // Add requested columns to MySQL query
        if (allColumns) {
            requestValues = this.allowedColumns;
        }
        mysqlBuilder.addColumnsToGet(requestValues.filter((value) => {if (value !== "timeTypeName") return `t.${value}`}));
    
        // Send MySQL query and convert dates to number format
        let response:MySQLResponse = await this.mySQL.sendQuery(mysqlBuilder.build());
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");
        for (const result of response.results) {
            if (result.startDate) result.startDate = this.mySQL.dateToNumber(result.startDate);
            if (result.endDate)   result.endDate   = this.mySQL.dateToNumber(result.endDate);
        }

        return response.results;
    }

}

export default TaskEndpoint;