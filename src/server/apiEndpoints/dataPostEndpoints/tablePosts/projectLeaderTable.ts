import {MySQLResponse} from "../../../database/mysqlHandler";
import MysqlQueryBuilder from "../../../database/mysqlStringBuilder";
import {mysqlHandler} from "../../../../app";
import {arrayToStringArray} from "../../../utility/array";

/**
 * Adds project leaders to the PROJECTS_MANAGER_CONNECTOR table
 * @param {number[]} projectLeaders - An array of user IDs representing project leaders
 * @param {number} projectId - The ID of the project to add the leaders to
 * @throws Will throw an error if the insert fails
 */
export async function addProjectLeader(projectLeaders: number[], projectId: number): Promise<void> {
    if (!await validateProjectLeaders(projectLeaders)) throw new Error("Not all users are project leaders");

    // Create an array of arrays containing the user IDs and project ID
    let projectLeadersValues: string[][] = [];
    for (const projectLeader of projectLeaders) {
        projectLeadersValues.push([projectLeader.toString(), projectId.toString()]);
    }

    // Insert the data into the PROJECTS_MANAGER_CONNECTOR table
    let managerResponse: MySQLResponse = await this.mySQL.insert("PROJECTS_MANAGER_CONNECTOR",
        ["userId", "projectId"],
        projectLeadersValues);
    if (managerResponse.error !== null) throw new Error("[MySQL] Failed insert data");
}

/**
 * Checks if a list of users are project leaders
 * @param {number[]} projectLeaders List of users to check
 * @return {boolean} True if all project leaders, otherwise false
 */
export async function validateProjectLeaders(projectLeaders: number[]) {
    // Check if the provided users are actual project leaders
    let mysqlStringBuilder: MysqlQueryBuilder = new MysqlQueryBuilder();

    // Filter by role id and user id, so results will only be valid project leaders
    let baseWhere: string = mysqlStringBuilder.where(["roleId", ["3"]]);
    mysqlStringBuilder.from("USERS_ROLES_CONNECTOR", ["userId", arrayToStringArray(projectLeaders)], baseWhere)
        .addColumnsToGet(["roleId"]);

    // Retrieve data from database and check if list is equally long, meaning all users are project leaders
    let response: MySQLResponse = await mysqlHandler.sendQuery(mysqlStringBuilder.build());
    return response.results.length === projectLeaders.length;
}
