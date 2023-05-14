import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";
import {addProjectLeader, validateProjectLeaders} from "./tablePosts/projectLeaderTable";
import {createAndAddTasksToProject} from "./tablePosts/taskProject";
import {TaskData} from "./tablePosts/taskTable";

interface ProjectCreationData {
    superProjectId?: number,
    name           : string,
    startDate      : number,
    endDate        : number,
    projectLeader  : number[],
    task          ?: TaskData[]
}

/**
 * Checks if a given date is valid.
 * @param {number} date - The date to check, represented as a Unix timestamp.
 * @returns {boolean} - True if the date is valid (1970 < data < 2100), false otherwise.
 */
export function dateValid(date: number) {
    return (date > new Date("1970-01-01").getTime() && date < new Date("2100-01-01").getTime())
}

/**
 * Checks if the provided project creation data is valid.
 * @param {any} obj - The project creation data to validate.
 * @returns {Promise<boolean>} - True if the data is valid, false otherwise.
 */
async function isValidProjectCreationData(obj: any): Promise<string[]> {
    let missing: string[] = [];
    // Check if all required objects are present
    if (!("name" in obj && "startDate" in obj && "endDate" in obj && "projectLeader" in obj)) return ["Object invalid"];
    // Check if dates are valid
    if (!dateValid(obj.startDate) || !dateValid(obj.endDate)) missing.push("Date invalid");
    // Check if name is a string and is at least one character
    if (typeof obj.name !== "string" || obj.name.length < 1) missing.push("Name invalid");
    // Validate all users are project leaders
    if (!await validateProjectLeaders(obj.projectLeader)) missing.push("Project leaders invalid");
    return missing;
}

class ProjectCreationEndpoint extends PostEndpointBase {
    requiredRole: number = 3;

    /**
     * Submits project creation data to the server.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<string[]>} - A promise that resolves to an array of strings indicating success or error messages.
     */
    async submitData(req: Request, res: Response): Promise<string[]> {
        let project: ProjectCreationData = req.body;

        // Check if the project creation data is valid
        let missing: string[] = await isValidProjectCreationData(project);
        if (missing.length !== 0) {
            return missing;
        }

        // Format column data
        let superProjectId: string = project.superProjectId ? project.superProjectId.toString() : "-1";
        let startDate: string = this.mySQL.dateFormatter(project.startDate);
        let endDate  : string = this.mySQL.dateFormatter(project.endDate);

        // Insert project data into the database
        let projectResponse: MySQLResponse = await this.mySQL.insert("PROJECTS",
            ["superProjectId", "name", "startDate", "endDate"],
            [superProjectId, project.name, startDate, endDate]);
            
        // Throw error if error happened during insertion
        if (projectResponse.error !== null) throw new Error("[MySQL] Failed insert data");

        // Add project leaders to the project
        let projectId: number = projectResponse.results.insertId;
        await addProjectLeader.call(this, project.projectLeader, projectId);

        // Add tasks to the project if any exist
        if (project.task) await createAndAddTasksToProject.call(this, project.task, projectId);

        // Return success message
        return Promise.resolve(["success"]);
    }
}

export default ProjectCreationEndpoint;