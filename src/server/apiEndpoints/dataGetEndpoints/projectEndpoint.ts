import EndpointBase from "../endpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

/**
 * Endpoint for .../api/project/get
 */
class ProjectEndpoint extends  EndpointBase {
    allowedColumns: string[] = [
        "id",
        "superProjectId",
        "name",
        "startDate",
        "endDate",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let response:MySQLResponse = await this.mySQL.select("projects", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));

        if (response.error !== null) return [{error: "Failed to retrieve data"}];

        for (const result of response.results) {
            if (result.startDate) result.startDate = this.mySQL.dateToNumber(result.startDate);
            if (result.endDate)   result.endDate = this.mySQL.dateToNumber(result.endDate);
        }

        return response.results;
    }
}

export default ProjectEndpoint;