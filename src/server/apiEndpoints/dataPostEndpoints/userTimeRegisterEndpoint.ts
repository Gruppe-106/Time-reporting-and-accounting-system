import PostEndpointBase from "../postEndpointBase";
import { Request, Response } from "express-serve-static-core";
import { MySQLResponse } from "../../database/mysqlHandler";
import { dateValid } from "./projectCreationEndpoint";
import { mysqlHandler } from "../../../app";
import MysqlQueryBuilder, { MySQLJoinTypes } from "../../database/mysqlStringBuilder";

import "../../utility/array";


interface UserTimeRegisterData {
    date: number,
    taskId: number,
    userId: number,
    time: number,
}

interface TimeRegisterGetData {
    approved: boolean,
    managerLogged: boolean
}

/**
 * Validate user is assigned task and date is within task period
 * @param {number} date - The date to check as number
 * @param {number} taskId - The ID of the task to check.
 * @param {number} userId - The ID of the user to check.
 * 
 * @returns {Promise<boolean>} - True if the user is assigned task and date is within task period
 */
async function validateTaskPeriodAndUser(date: number, taskId: number, userId: number): Promise<boolean> {
    let mysqlBuilder: MysqlQueryBuilder = new MysqlQueryBuilder();

    // WHERE clause for the query, specifying that the date lies within the task period of given ID.
    let baseWhere: string = mysqlBuilder.whereDatesInPeriod(date);

    // Add the tasks table to the query, selecting the task with the given ID
    mysqlBuilder.from("TASKS", ["id", [taskId.toString()]], baseWhere, "t");

    // Join the users-tasks connector table to the query
    mysqlBuilder.join(MySQLJoinTypes.CROSS, "USERS_TASKS_CONNECTOR", `utc.taskId=t.id AND utc.userId=${userId}`, "utc");

    // Add columns to get
    mysqlBuilder.addColumnsToGet(["utc.taskId as 'taskId'", "utc.userId as 'userId'", "t.startDate as 'startDate'", "t.endDate as 'endDate'"]);

    // Execute the built query and retrieve the response.
    let response: MySQLResponse = await mysqlHandler.sendQuery(mysqlBuilder.build());

    // Return true if the response is non-null and non-empty, indicating that the user is assigned to the task
    if (response.error !== null || response.results.length === 0) {
        return false;
    }
    return true;
}


/**
 * Validates user time registration data.
 * @param {UserTimeRegisterData} data - The data to validate.
 * @returns {Promise<string[]>} - An array of string messages indicating missing or invalid fields.
 */
async function validateUserTimeRegisterData(data: UserTimeRegisterData): Promise<string[]> {
    let missing: string[] = [];

    // Checks if all required fields are present in the data object
    if (!("date" in data && "taskId" in data && "userId" in data && "time" in data)) return ["Fields missing"];

    // Checks if the date is valid
    if (!dateValid(data.date)) missing.push("Date not valid");

    // Checks if the task id is valid
    if (data.taskId < 1) missing.push("Task id not valid");

    // Validates user assignment to the task and whether the date is during the task period
    if (!await validateTaskPeriodAndUser(data.date, data.taskId, data.userId)) {
        missing.push("User isn't assigned to task or date outside task period");
    }

    // Checks if time is less than 0 or greater than 24 hours (1440 minutes)
    if (data.time < 0 || data.time > 1440) missing.push("Time is less than 0 or more than 1440 minutes (24 hours)");

    return missing;
}


class UserTimeRegisterEndpoint extends PostEndpointBase {
    requiredRole: number = 1;

    /**
     * Submits user time registration data
     * @param {Request} req - The request.
     * @param {Response} res - The response.
     * @returns {Promise<string[]>} - An array of strings indicating any missing or invalid fields or "success".
     */
    async submitData(req: Request, res: Response): Promise<string[]> {
        let timeRegisterData: UserTimeRegisterData = req.body;

        // Validate data
        let missing: string[] = await validateUserTimeRegisterData(timeRegisterData);
        if (missing.length !== 0) return missing;

        // First check if the time register already exists in the DB
        let timeRegisterGetResponse: MySQLResponse = await this.mySQL.select("USERS_TASKS_TIME_REGISTER", ["approved", "managerLogged"], [
            { column: "userId", equals: [timeRegisterData.userId.toString()] },
            { column: "taskId", equals: [timeRegisterData.taskId.toString()] },
            { column: "date", equals: [this.mySQL.dateFormatter(timeRegisterData.date)] }
        ]);

        let timeRegisterGetResult: TimeRegisterGetData[] = timeRegisterGetResponse.results;

        // If not, add the data to the DB and return "success" message. Otherwise, return message indicating that
        // the registration already exists.
        if (timeRegisterGetResult.length === 0) {
            let timeRegisterResponse: MySQLResponse = await this.mySQL.insert("USERS_TASKS_TIME_REGISTER",
                ["date", "taskId", "userId", "time", "approved", "managerLogged"],
                [
                    this.mySQL.dateFormatter(timeRegisterData.date),
                    timeRegisterData.taskId.toString(),
                    timeRegisterData.userId.toString(),
                    timeRegisterData.time.toString(),
                    "false",
                    "false"
                ]
            )
            if (timeRegisterResponse.error !== null) throw new Error("[MySQL] Failed to insert data");

            return Promise.resolve(["success"]);
        } else {
            return Promise.resolve(["Registration already exists, use edit instead"]);
        }
    }
}

export default UserTimeRegisterEndpoint;