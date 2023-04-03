import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";

interface ProjectCreationData {
    superProjectId?: number,
    name           : string,
    startDate      : number,
    endDate        : number,
    projectLeader  : number,
    task?: {
        name       : string,
        userId     : number[],
        startDate  : number,
        endDate    : number,
        timeType   : number
    }[]
}

class ProjectCreationEndpoint extends PostEndpointBase {
    requiredRole: number = 3;

    async submitData(req: Request, res: Response): Promise<string[]> {
        //Get data from the user creation form
        let project: ProjectCreationData = req.body;

        let projectResponse: MySQLResponse = await this.mySQL.insert("USERS",
            ["superProjectId", "name", "startDate", "endDate"],
            [project.superProjectId ? project.superProjectId.toString() : "-1", project.name, this.mySQL.dateFormatter(project.startDate), this.mySQL.dateFormatter(project.endDate)]);
        if (projectResponse.error !== null) throw new Error("[MySQL] Failed insert data");

        let projectId: number = projectResponse.results.insertId;

        let managerResponse: MySQLResponse = await this.mySQL.insert("PROJECTS_MANAGER_CONNECTOR",
            ["userId", "projectId"],
            [project.projectLeader.toString(), projectId.toString()]);
        if (managerResponse.error !== null) throw new Error("[MySQL] Failed insert data");

        if (project.task) {
            for (const task of project.task) {
                let taskResponse: MySQLResponse = await this.mySQL.insert("TASKS",
                    ["name", "startDate", "endDate", "timeType"],
                    [task.name, this.mySQL.dateFormatter(task.startDate), this.mySQL.dateFormatter(task.endDate), task.timeType.toString()]);
                if (taskResponse.error !== null) throw new Error("[MySQL] Failed insert data");
                let taskId: number = taskResponse.results.insertId;

                let userTask: string[][] = [];
                for (const user of task.userId) {
                    userTask.push([user.toString(), taskId.toString()]);
                }

                let userTaskResponse: MySQLResponse = await this.mySQL.insert("TASKS",
                    ["userId", "taskId"],
                    userTask);
                if (userTaskResponse.error !== null) throw new Error("[MySQL] Failed insert data");
            }
        }

        return Promise.resolve(["success"]);
    }
}

export default ProjectCreationEndpoint;