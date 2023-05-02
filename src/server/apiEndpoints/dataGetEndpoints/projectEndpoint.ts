import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

/**
 * Structure of object returned to client
 */
interface ProjectData {
    id?: number,
    superProject?: number,
    name?: string,
    startDate?: number,
    endDate?: number,
    projectLeader?: {
        id: number,
        lastName: string,
        firstName: string
    }
}

/**
 * Data retrieved from project leader database
 */
interface ProjectLeaderData {
    id: number,
    lastName: string,
    firstName: string,
    projectId: number
}

/**
 * Endpoint for .../api/project/get
 */
class ProjectEndpoint extends GetEndpointBase {
    requiredRole: number = 1;

    allowedColumns: string[] = [
        "id",
        "superProjectId",
        "name",
        "startDate",
        "endDate",
        "projectLeader",
        "*"
    ];

/**
     * Retrieves project data and project leader from the database
     * @param requestValues Columns to get data from
     * @param primaryKey The primary key to match
     * @param keyEqual What the primary key should match
     * @returns An array of project data with optional project leaders
     */
    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        let projectData: ProjectData[] = [];
        let getAll: boolean = requestValues.indexOf("*") !== -1;
        
        // If projectLeader is requested, add id to requestValues
        if (!getAll && requestValues.indexOf("projectLeader") !== -1) {
            if (requestValues.indexOf("id") === -1) requestValues.push("id");
        }
        
        // Retrieve project data from database
        let response: MySQLResponse = await this.mySQL.select("PROJECTS", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        // Retrieve project leader data if requested
        let projectLeaderData: ProjectLeaderData[] = [];
        if (requestValues.indexOf("projectLeader") !== -1 || getAll) {
            let leaderResponse: MySQLResponse = await this.mySQL.sendQuery(
                `SELECT pm.projectId,pm.userId as id,u.lastName,u.firstName FROM 
                (SELECT * FROM PROJECTS_MANAGER_CONNECTOR ${this.mySQL.createWhereString({column: "projectId", equals: keyEqual})}) pm 
                CROSS JOIN USERS u ON pm.userId=u.id`
            );

            if (leaderResponse.error === null) projectLeaderData = leaderResponse.results;
        }

        // Convert dates to number format
        projectData = response.results;
        for (const index in response.results) {
            // Convert dates if any in the object
            if (response.results[index].startDate) {
                projectData[index].startDate = this.mySQL.dateToNumber(new Date(response.results[index].startDate));
            }
            if (response.results[index].endDate) {
                projectData[index].endDate = this.mySQL.dateToNumber(new Date(response.results[index].endDate));
            }
            // Add project leaders if any match the current project id
            if (projectLeaderData.length !== 0) {
                for (const projectLeader of projectLeaderData) {
                    if (projectLeader.projectId === response.results[index].id) {
                        projectData[index].projectLeader = {
                            id       : projectLeader.id,
                            lastName : projectLeader.lastName,
                            firstName: projectLeader.firstName
                        };
                        break;
                    }
                }
            }
        }

        return projectData;

    }

}

export default ProjectEndpoint;