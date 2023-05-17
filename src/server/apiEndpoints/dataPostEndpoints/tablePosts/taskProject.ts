import {MySQLResponse} from "../../../database/mysqlHandler";
import {addUsersToTask, insertTask, TaskData} from "./taskTable";
/**
 * Inserts task data into the database and connects it to a project if projectId is provided
 * @param {TaskData[]} taskData - Array of task data to be inserted
 * @param {number} [projectId] - Optional projectId to connect the tasks to
 * @throws Throws an error if the insert fails
 */
export async function createAndAddTasksToProject(taskData: TaskData[], projectId?: number): Promise<void> {
    // Loop through each task in the array of task data
    for (const task of taskData) {
        let taskId: number = await insertTask(task);
        if (taskId < 1) continue;
        // If projectId is provided, connect the task to the project
        if(projectId !== undefined) await taskProjectConnector.call(this, taskId, projectId);
        // Add the users to the task
        await addUsersToTask.call(this, task.userId, taskId);
    }
}

/**
 * Connects a task to a project in the database
 * @param {number} taskId - The id of the task to connect
 * @param {number} projectId - The id of the project to connect to
 * @throws Throws an error if the insert fails
 */
export async function taskProjectConnector(taskId: number, projectId: number): Promise<void> {
    if (taskId < 1 || projectId < 1) return;
    // Insert the task-project connection data into the database
    let taskProjectConnectorResponse: MySQLResponse = await this.mySQL.insert("TASKS_PROJECTS_CONNECTOR",
        ["taskId", "projectId"],
        [taskId.toString(), projectId.toString()]);
    // Throw an error if the insert fails
    if (taskProjectConnectorResponse.error !== null) throw new Error("[MySQL] Failed insert data");
}
