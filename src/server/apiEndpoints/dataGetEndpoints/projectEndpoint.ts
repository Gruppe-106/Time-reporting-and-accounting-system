import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

/**
 * Endpoint for .../api/project/get
 */
class ProjectEndpoint extends  GetEndpointBase {
    requiredRole: number = 1;

    allowedColumns: string[] = [
        "id",
        "superProjectId",
        "name",
        "startDate",
        "endDate",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        //Get all projects that fulfill the given request
        let response:MySQLResponse = await this.mySQL.select("PROJECTS", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));

        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        //Convert dates to number format
        for (const result of response.results) {
            if (result.startDate) result.startDate = this.mySQL.dateToNumber(new Date(result.startDate));
            if (result.endDate)   result.endDate   = this.mySQL.dateToNumber(new Date(result.endDate));
        }

        return response.results;
    }
}

export default ProjectEndpoint;