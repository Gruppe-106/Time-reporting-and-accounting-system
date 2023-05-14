import {MySQLResponse} from "../../../database/mysqlHandler";
import {dateValid} from "../projectCreationEndpoint";

export interface TaskData {
    name       : string,
    userId     : number[],
    startDate  : number,
    endDate    : number,
    timeType   : number
}

/**
 * Adds users to a task in the database
 * @param {number[]} users - An array of user IDs to add to the task
 * @param {number} taskId - The ID of the task to add users to
 * @throws {Error} Throws an error if the data fails to insert
 */ 
export async function addUsersToTask(users: number[], taskId: number): Promise<void> {
    // Check if there is anything to add
    if (users.length < 1) return;
    // Create an array of [user IDs, task IDs]
    let userTask: string[][] = [];
    for (const user of users) {
        userTask.push([user.toString(), taskId.toString()]);
    }

    // Insert the user-task data into the database
    let userTaskResponse: MySQLResponse = await this.mySQL.insert("USERS_TASKS_CONNECTOR",
        ["userId", "taskId"],
        userTask);
    if (userTaskResponse.error !== null) throw new Error("[MySQL] Failed insert data");
}

/**
 * Validates task data
 * @param {TaskData} task - The task data to validate
 * @returns {boolean} - Returns true if the task data is valid, false otherwise
 */
function validateTaskData(task: TaskData): boolean {
    // Check if all required objects are present
    if (!("name" in task && "userId" in task && "startDate" in task && "endDate" in task && "timeType" in task)) return false;
    // Check if name is a string and is at least one character
    if (typeof task.name !== "string" || task.name.length < 1) return false;
    // Check if list of user id is a list (It can be empty and only valid users will be added, so contents doesn't matter)
    if (!Array.isArray(task.userId)) return false;
    // Check if time type is valid
    if (task.timeType < 1 || task.timeType > 4) return false;
    // Check if dates are valid
    if (!dateValid(task.startDate) || !dateValid(task.endDate)) return false;
    return false;
}

/**
 * Inserts a new task into the database
 * @param {TaskData} task - The task data to insert
 * @returns {Promise<number>} - The ID of the inserted task
 * @throws {Error} Throws an error if the data fails to insert
 */ 
export async function insertTask(task: TaskData): Promise<number> {
    if (!validateTaskData(task)) return -1;
    // Insert the task data into the database
    let taskResponse: MySQLResponse = await this.mySQL.insert("TASKS",
        ["name", "startDate", "endDate", "timeType"],
        [task.name, this.mySQL.dateFormatter(task.startDate), this.mySQL.dateFormatter(task.endDate), task.timeType.toString()]);
    // Throw an error if the insert fails
    if (taskResponse.error !== null) throw new Error("[MySQL] Failed insert data");
    // Return id of the inserted task
    return taskResponse.results.insertId;
}

