import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {addUsersToTask, taskProjectConnector} from "../dataPostEndpoints/projectCreationEndpoint";
import {MySQLResponse, UpdateSet} from "../../database/mysqlHandler";

interface TaskEditData {
    taskId     : number,
    delete    ?: boolean,
    name      ?: string,
    startDate ?: number,
    endDate   ?: number,
    timeType  ?: number,
    addUser   ?: number[],
    removeUser?: number[],
    projects  ?: number[]
}

export async function addTaskToMultiProject(taskId:number, projectIds: number[]): Promise<void> {
    for (const projectId of projectIds) {
        try {
            await taskProjectConnector.call(this, taskId, projectId);
        } catch (e) {
            // Ignore
        }
    }
}

export async function removeUsersTFromTask(users: number[], taskId: number): Promise<string[]> {
    let message: string[] = [];
    for (const user of users) {
        let userTaskResponse: MySQLResponse = await this.mySQL.remove("USERS_TASKS_CONNECTOR",
            [{column: "userId", equals: [user.toString()]}, {column: "taskId", equals: [taskId.toString()]}]);
        if (userTaskResponse.error !== null) message.push(`Failed to remove ${user} from task ${taskId}`);
    }
    return message;
}

class TaskEditEndpoint extends PostEndpointBase {
    requiredRole: number = 3;
    async submitData(req: Request, res: Response): Promise<string[]> {
        let message: string[] = ["success"];
        //Get data from the user creation form
        let taskData: TaskEditData = req.body;

        // Create the update set and append any the requester wishes to change
        let taskUpdateSet: UpdateSet[] = [];
        if (taskData.name) taskUpdateSet.push({column: "name", value: taskData.name});
        if (taskData.startDate) taskUpdateSet.push({column: "startDate", value: this.mySQL.dateFormatter(taskData.startDate)});
        if (taskData.endDate) taskUpdateSet.push({column: "endDate", value: this.mySQL.dateFormatter(taskData.endDate)});
        if (taskData.timeType) taskUpdateSet.push({column: "timeType", value: taskData.timeType.toString()});

        if (taskUpdateSet.length !== 0) {
            // Send update request to DB
            let taskResponse: MySQLResponse = await this.mySQL.update("TASKS", taskUpdateSet, {column: "id", equals: [taskData.taskId.toString()]});
            // Check if it failed to update
            if (taskResponse.error !== null) message.push("Task couldn't be updated");
        }

        // Add users to task if any
        if (taskData.addUser) await addUsersToTask.call(this, taskData.addUser, taskData.taskId);

        // Remove users if any,
        let userRemoveMessage: string[] = [];
        if (taskData.removeUser) { userRemoveMessage = await removeUsersTFromTask.call(this, taskData.addUser, taskData.taskId); }
        if (userRemoveMessage.length !== 0) { message.concat(userRemoveMessage); }

        // Add task to multi projects
        if (taskData.projects) await addTaskToMultiProject.call(this, taskData.taskId, taskData.projects);

        return Promise.resolve(message);
    }
}

export default TaskEditEndpoint;