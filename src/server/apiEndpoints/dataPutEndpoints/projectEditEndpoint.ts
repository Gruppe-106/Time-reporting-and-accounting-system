import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse, UpdateSet} from "../../database/mysqlHandler";
import {taskProjectConnector} from "../dataPostEndpoints/tablePosts/taskProject";

export interface ProjectEditData {
    projectId            : number,
    superProjectId      ?: number,
    name                ?: string,
    startDate           ?: number,
    endDate             ?: number,
    projectLeader       ?: number,
    taskAdd             ?: number[],
    taskRemove          ?: number[]
}

export async function addMultiTaskToProject(taskIds:number[], projectId:number) {
    for (const taskId of taskIds) {
        try {
            await taskProjectConnector.call(this, taskId, projectId);
        } catch (e) {
            //Ignore
        }
    }
}

export async function removeTaskFromProject(taskIds: number[], projectId: number) {
    let taskIdsString: string[] = taskIds.map<string>((value) => { return value.toString();} )
    let taskProjectResponse: MySQLResponse = await this.mySQL.remove("TASKS_PROJECTS_CONNECTOR", [{
        column: "taskId",
        equals: taskIdsString
    }, {
        column: "projectId",
        equals: [projectId.toString()]
    }]);
    if (taskProjectResponse.error !== null) throw new Error("[MySQL] Failed insert data");
}

class ProjectEditEndpoint extends PostEndpointBase {
    requiredRole: number = 3;
    async submitData(req: Request, res: Response): Promise<string[]> {
        let message: string[] = [];
        //Get data from the user creation form
        let projectData: ProjectEditData = req.body;

        if (projectData.projectId === undefined) return ["Missing project id"];

        if (projectData.projectId === undefined) return ["Missing id"];

        // Create the update set and append any the requester wishes to change
        let projectUpdateSet: UpdateSet[] = [];
        if (projectData.superProjectId) projectUpdateSet.push({column: "superProjectId", value: projectData.superProjectId.toString()})
        if (projectData.name)           projectUpdateSet.push({column: "name", value: projectData.name})
        if (projectData.startDate)      projectUpdateSet.push({column: "startDate", value: this.mySQL.dateFormatter(projectData.startDate)})
        if (projectData.endDate)        projectUpdateSet.push({column: "endDate", value: this.mySQL.dateFormatter(projectData.endDate)})

        if (projectUpdateSet.length !== 0) {
            // Send update request to DB
            let userResponse: MySQLResponse = await this.mySQL.update("PROJECTS", projectUpdateSet, {column: "id", equals: [projectData.projectId.toString()]});
            // Check if it failed to update
            if (userResponse.error !== null) message.push("Project couldn't be updated");
        }

        if (projectData.projectLeader) await this.mySQL.update("PROJECTS_MANAGER_CONNECTOR", [{column: "userId", value: projectData.projectLeader.toString()}], {column: "projectId", equals: [projectData.projectId.toString()]})
        // Create task and add it to the connector table if any
        if (projectData.taskAdd) await addMultiTaskToProject.call(this, projectData.taskAdd, projectData.projectId);
        // Remove task project connection if any
        if (projectData.taskRemove) await removeTaskFromProject.call(this, projectData.taskRemove, projectData.projectId);

        return message.length !== 0 ? Promise.resolve(message) : Promise.resolve(["success"]);
    }
}

export default ProjectEditEndpoint;