import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";

export interface TaskData {
    name       : string,
    userId     : number[],
    startDate  : number,
    endDate    : number,
    timeType   : number
}

interface ProjectCreationData {
    superProjectId?: number,
    name           : string,
    startDate      : number,
    endDate        : number,
    projectLeader  : number[],
    task          ?: TaskData[]
}

export async function addUsersToTask(users: number[], taskId: number): Promise<void> {
    let userTask: string[][] = [];
    for (const user of users) {
        userTask.push([user.toString(), taskId.toString()]);
    }

    let userTaskResponse: MySQLResponse = await this.mySQL.insert("USERS_TASKS_CONNECTOR",
        ["userId", "taskId"],
        userTask);
    if (userTaskResponse.error !== null) throw new Error("[MySQL] Failed insert data");
}

export async function taskProjectConnector(taskId: number, projectId: number): Promise<void> {
    let taskProjectConnectorResponse: MySQLResponse = await this.mySQL.insert("TASKS_PROJECTS_CONNECTOR",
        ["taskId", "projectId"],
        [taskId.toString(), projectId.toString()]);
    if (taskProjectConnectorResponse.error !== null) throw new Error("[MySQL] Failed insert data");
}

export async function addTaskToProject(taskData: TaskData[], projectId?: number): Promise<void> {
    for (const task of taskData) {
        let taskResponse: MySQLResponse = await this.mySQL.insert("TASKS",
            ["name", "startDate", "endDate", "timeType"],
            [task.name, this.mySQL.dateFormatter(task.startDate), this.mySQL.dateFormatter(task.endDate), task.timeType.toString()]);
        if (taskResponse.error !== null) throw new Error("[MySQL] Failed insert data");
        let taskId: number = taskResponse.results.insertId;
        if(projectId !== undefined) await taskProjectConnector.call(this, taskId, projectId);
        await addUsersToTask.call(this, task.userId, taskId);
    }
}

export async function addProjectLeader(projectLeaders: number[], projectId: number) {
    let projectLeadersValues: string[][] = [];
    for (const projectLeader of projectLeaders) {
        projectLeadersValues.push([projectLeader.toString(), projectId.toString()]);
    }

    let managerResponse: MySQLResponse = await this.mySQL.insert("PROJECTS_MANAGER_CONNECTOR",
        ["userId", "projectId"],
        projectLeadersValues);
    if (managerResponse.error !== null) throw new Error("[MySQL] Failed insert data");
}

class ProjectCreationEndpoint extends PostEndpointBase {
    requiredRole: number = 3;

    async submitData(req: Request, res: Response): Promise<string[]> {
        //Get data from the user creation form
        let project: ProjectCreationData = req.body;

        let projectResponse: MySQLResponse = await this.mySQL.insert("PROJECTS",
            ["superProjectId", "name", "startDate", "endDate"],
            [project.superProjectId ? project.superProjectId.toString() : "-1", project.name, this.mySQL.dateFormatter(project.startDate), this.mySQL.dateFormatter(project.endDate)]);
        if (projectResponse.error !== null) throw new Error("[MySQL] Failed insert data");

        let projectId: number = projectResponse.results.insertId;
        await addProjectLeader.call(this, project.projectLeader, projectId);

        if (project.task) await addTaskToProject.call(this, project.task, projectId);

        return Promise.resolve(["success"]);
    }
}

export default ProjectCreationEndpoint;