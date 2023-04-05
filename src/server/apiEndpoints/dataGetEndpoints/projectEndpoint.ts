import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";

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

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let projectData: ProjectData[] = [];
        let getAll: boolean = requestValues.indexOf("*") !== -1;
        //Get all projects that fulfill the given request
        if (requestValues.indexOf("id") === -1 && (requestValues.indexOf("projectLeader") !== -1 || getAll)) requestValues.push("id");
        let response: MySQLResponse = await this.mySQL.select("PROJECTS", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));

        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        let projectLeaderData: ProjectLeaderData[] = [];
        if (requestValues.indexOf("projectLeader") !== -1. || getAll) {
            let leaderResponse: MySQLResponse = await this.mySQL.sendQuery(`SELECT pm.projectId,pm.userId as id,u.lastName,u.firstName FROM 
                (SELECT * FROM PROJECTS_MANAGER_CONNECTOR ${this.mySQL.createWhereString({column: "projectId", equals: keyEqual})}) pm 
                CROSS JOIN USERS u ON pm.userId=u.id`
            );
            if (leaderResponse.error === null) {
                projectLeaderData = leaderResponse.results;
            }
        }

        //Convert dates to number format
        projectData = response.results;
        for (const index in response.results) {
            if (response.results[index].startDate) projectData[index].startDate = this.mySQL.dateToNumber(new Date(response.results[index].startDate));
            if (response.results[index].endDate)   projectData[index].endDate   = this.mySQL.dateToNumber(new Date(response.results[index].endDate));
            if (projectLeaderData.length !== 0) {
                leaderLoop:for (const projectLeader of projectLeaderData) {
                    if (projectLeader.projectId === response.results[index].id) {
                        projectData[index].projectLeader = {
                            id       : projectLeader.id,
                            lastName : projectLeader.lastName,
                            firstName: projectLeader.firstName
                        };
                        break leaderLoop;
                    }
                }
            }
        }


        return projectData;
    }
}

export default ProjectEndpoint;