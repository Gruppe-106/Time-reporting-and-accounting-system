import PostEndpointBase from "../postEndpointBase";
import { Request, Response } from "express";
import { MySQLResponse } from "../../database/mysqlHandler";
import { AuthKey, authKeyCreate } from "../../utility/authKeyCreator";

import "../../utility/array";
import {mysqlHandler} from "../../../app";

interface UserCreationData {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    manager: number,
    roles: number[]
}

/**
* Retrieves the group ID associated with the provided manager ID from the "GROUPS_CONNECTOR" table
* @param mangerId number: the ID of the manager whose group ID is being retrieved  
* @returns Promise<number>: resolves with the group ID associated with the provided manager ID or -1 if missing
*/
async function getGroupIdFromManagerId(mangerId: number): Promise<number> {
    // Retrieve group information from database
    let groupResponse: MySQLResponse = await mysqlHandler.select("GROUPS_CONNECTOR", ["groupId"], {
        column: "managerId",
        equals: [mangerId.toString()]
    });
    // If an error occured, return -1 as group couldn't be found
    if (groupResponse.error !== null) return -1;
    return groupResponse.results[0].groupId;
}

/**
 * Validates user creation data. Ensures that parameters fulfill certain requirements
 * @param {UserCreationData} user : the user data for the request
 * @returns {[number, string[]]} A promise resolving to a tuple: [groupId:number, missing:string[]]
 *  - groupId: the ID for the group the manager presides over, or -1 if it couldn't be obtained
 *  - missing: a list of missing or incorrect parameters, empty if all is correctly filled in
 */
async function validateUserCreationData(user: UserCreationData): Promise<[number, string[]]> {
    let missing: string[] = [];

    // Check if first & last name is a string and is at least one character
    if (typeof user.firstName !== "string" || user.firstName.length < 1) missing.push("First name not valid");
    if (typeof user.lastName !== "string" || user.lastName.length < 1) missing.push("Last name not valid");

    // Input validate email address
    const emailValid: boolean = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
    if (!emailValid) missing.push("Email not valid");

    // Validate that password is a sha-256, at least within reason
    if (typeof user.password !== "string" || user.password.length !== 64) missing.push("Password invalid");

    // Get the group id the manager presides over
    let groupId = await getGroupIdFromManagerId(user.manager);
    if (groupId < 1) missing.push("Group not found");

    // Validate roles
    let validRoles: number[] = user.roles.filter((value) => { if (value > 0 && value < 5) return value });
    if (validRoles.length !== user.roles.length) missing.push("Roles not valid");

    return [groupId, missing];
}

/**
 * Inserts a user into the USERS table of the MySQL database
 * @param {UserCreationData} user : the user data for the request
 * @param {number} groupId : the ID of the group to which the user belongs
 * @returns {Promise<number>} A promise that resolves with the ID of the inserted user
 * @throws {Error} Throws error if the user could not be inserted
 */
async function insertUser(user: UserCreationData, groupId: number): Promise<number> {
    // Insert new user into USERS table
    let userResponse: MySQLResponse = await mysqlHandler.insert("USERS",
        ["email", "firstName", "lastName", "groupId"],
        [user.email, user.firstName, user.lastName, groupId.toString()])

    // Check for errors and throw if needed
    if (userResponse.error !== null) {
        throw new Error("[MySQL] Failed insert data");
    }

    // Return the ID of the inserted user
    return userResponse.results.insertId;
}

class UserCreationEndpoint extends PostEndpointBase {
    requiredRole: number = 4;

    /**
     * Submits user creation data to the MySQL database
     * @param {Request} req the request object of the user 
     * @param {Response} res the response object of the user 
     * @returns {Promise<string[]>} returns either "success" if all went perfectly, 
     * otherwise, it returns a list of error messages. Beware, messages are returned from some endpoints, even if they succeeded.
     */
    async submitData(req: Request, res: Response): Promise<string[]> {
        //Get data from the user creation form
        let user: UserCreationData = req.body;
        let [groupId, missing] = await validateUserCreationData(user);

        if (missing.length > 0) return missing;
        let userId: number = await insertUser(user, groupId);

        // Make a list of all user roles to add to connector
        let userRoles: string[][] = [];
        for (const userRole of user.roles) {
            userRoles.push([userId.toString(), userRole.toString()])
        }

        // Append all roles the user has to the user role connector table
        let userRoleResponse: MySQLResponse = await this.mySQL.insert("USERS_ROLES_CONNECTOR", ["userId", "roleId"], userRoles);
        if (userRoleResponse.error !== null) missing.push("Couldn't add roles");

        // Create group for the user if they manager role
        if (user.roles.contains(2)) {
            let userGroupResponse: MySQLResponse = await this.mySQL.insert("GROUPS_CONNECTOR", ["managerId"], [userId.toString()]);
            if (userGroupResponse.error !== null) missing.push("Group couldn't be created");
        }

        // Add user to the authentication table
        let authKey: AuthKey = authKeyCreate(userId);
        let authResponse: MySQLResponse = await this.mySQL.insert("AUTH",
            ["email", "authKey", "authKeyEndDate", "userId", "password"],
            [user.email, authKey.key, this.mySQL.dateFormatter(authKey.valid), userId.toString(), user.password]);
        if (authResponse.error !== null) missing.push("Authentication couldn't be added");

        return Promise.resolve(["success", ...missing]);
    }
}

export default UserCreationEndpoint;