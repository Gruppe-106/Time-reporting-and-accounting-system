import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";
import {AuthKey, authKeyCreate} from "../../utility/authKeyCreator";

interface UserCreationData {
    firstName   : string,
    lastName    : string,
    email       : string,
    password    : string,
    manager     : number,
    roles       : number[]
}

async function getGroupIdFromManagerId(user: UserCreationData): Promise<number> {
    let groupResponse: MySQLResponse = await this.mySQL.select("GROUPS_CONNECTOR", ["groupId"], {
        column: "managerId",
        equals: [user.manager.toString()]
    })
    if (groupResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");
    return groupResponse.results[0].groupId;
}

async function validateUserCreationData(user: UserCreationData): Promise<[number, string[]]> {
    let missing: string[] = [];
    // Check if first & last name is a string and is at least one character
    if (typeof user.firstName !== "string" || user.firstName.length < 1) missing.push("First name not valid");
    if (typeof user.lastName  !== "string" || user.lastName.length  < 1) missing.push("Last name not valid");

    // Input validate email address
    const emailValid: boolean = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
    if (!emailValid) missing.push("Email not valid");

    // Validate that password is a sha-256, at least within reason
    if (typeof user.password !== "string" || user.password.length !== 64) missing.push("Password invalid");

    // Get the group id the manager presides over
    let groupId = await getGroupIdFromManagerId(user);
    if (groupId < 1) missing.push("Group not found");

    // Validate roles
    let validRoles: number[] = user.roles.filter((value) => { if (value > 0 && value < 5) return value });
    if (validRoles.length !== user.roles.length) missing.push("Roles not valid");
    return [groupId, missing];
}

async function insertUser(user: UserCreationData) {
    let [groupId, missing] = await validateUserCreationData(user);
    if (missing.length > 0) return missing;

    let userResponse: MySQLResponse = await this.mySQL.insert("USERS",
        ["email", "firstName", "lastName", "groupId"],
        [user.email, user.firstName, user.lastName, groupId.toString()])
    if (userResponse.error !== null) throw new Error("[MySQL] Failed insert data");
    return userResponse.results.insertId
}

class UserCreationEndpoint extends PostEndpointBase {
    requiredRole: number = 4;

    /**
     * Submits user creation data to the MySQL database
     * @param req Request: request object of the requester
     * @param res Response: response object of the requester
     * @return string[]: returns either ["success"] if all went perfect, otherwise a list of messages.
     * Beware messages is returned from some endpoints even if they succeeded
     */
    async submitData(req: Request, res: Response): Promise<string[]> {
        //Get data from the user creation form
        let user: UserCreationData = req.body;

        let userId: number = await insertUser(user);

        // Make a list of all user roles to add to connector
        let createGroup: boolean = false;
        let userRoles: string[][] = [];
        for (const userRole of user.roles) {
            if (userRole === 2) createGroup = true;
            userRoles.push([userId.toString(), userRole.toString()])
        }

        // Append all roles the user has to the user role connector table
        let userRoleResponse: MySQLResponse = await this.mySQL.insert("USERS_ROLES_CONNECTOR", ["userId", "roleId"], userRoles);
        if (userRoleResponse.error !== null) throw new Error("[MySQL] Failed insert data");

        // Create group for the user if they manager role
        if (createGroup) {
            let userGroupResponse: MySQLResponse = await this.mySQL.insert("GROUPS_CONNECTOR", ["managerId"], [userId.toString()]);
            if (userGroupResponse.error !== null) throw new Error("[MySQL] Failed insert data");
        }

        // Add user to the authentication table
        let authKey: AuthKey = authKeyCreate(userId);
        let authResponse: MySQLResponse = await this.mySQL.insert("AUTH",
            ["email", "authKey", "authKeyEndDate", "userId", "password"],
            [user.email, authKey.key, this.mySQL.dateFormatter(authKey.valid), userId.toString(), user.password]);
        if (authResponse.error !== null) throw new Error("[MySQL] Failed insert data");

        return Promise.resolve(["success"]);
    }
}

export default UserCreationEndpoint;