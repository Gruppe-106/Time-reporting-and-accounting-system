import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse, UpdateSet, Where} from "../../database/mysqlHandler";

interface UserEditData {
    userId       : number,
    firstName   ?: string,
    lastName    ?: string,
    email       ?: string,
    password    ?: string,
    manager     ?: number,
    rolesAdd    ?: number[],
    rolesRemove ?: number[]
}

class UserEditEndpoint extends PostEndpointBase {
    requiredRole: number = 4;
    async submitData(req: Request, res: Response): Promise<string[]> {
        let message: string[] = [];
        //Get data from the user creation form
        let user: UserEditData = req.body;

        if (user.userId === undefined) {
            return ["Missing user id"];
        }

        if (user.userId === undefined) return ["Missing user id"];

        let userUpdateSet: UpdateSet[] = [];
        let authUpdateSet: UpdateSet[] = [];

        // Add edited columns in the users table
        if (user.firstName) userUpdateSet.push({column: "firstName", value: user.firstName});
        if (user.lastName)  userUpdateSet.push({column: "lastName", value: user.lastName});
        if (user.manager) {
            // Get the group id of the manager
            let groupResponse: MySQLResponse = await this.mySQL.select("GROUPS_CONNECTOR", ["groupId"], {column: "managerId", equals: [user.manager.toString()]})
            if (groupResponse.error !== null) message.push("Manager data couldn't be retrieved");
            let groupId = groupResponse.results[0].groupId;
            // Check if the group id is different from the altered
            userUpdateSet.push({column: "groupId", value: groupId.toString()});
        }
        // Input validate email address and add if edited
        if (user.email) {
            const emailValid: boolean = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
            if (!emailValid) {
                message.push("Email not valid");
            } else {
                userUpdateSet.push({column: "email", value: user.email});
            }
        }
        if (userUpdateSet.length !== 0) {
            // Send update request to DB
            let userResponse: MySQLResponse = await this.mySQL.update("USERS", userUpdateSet, {column: "id", equals: [user.userId.toString()]});
            // Check if it failed to update
            if (userResponse.error !== null) message.push("User couldn't be updated");
        }

        // Add edited columns in the utility table
        if (user.password) authUpdateSet.push({column: "password", value: user.password});
        if (authUpdateSet.length !== 0) {
            // Send update request to DB
            let authResponse: MySQLResponse = await this.mySQL.update("AUTH", authUpdateSet, {column: "userId", equals: [user.userId.toString()]});
            // Check if it failed to update
            if (authResponse.error !== null) message.push("Auth couldn't be updated");
        }

        // Add roles from user if any
        if (user.rolesAdd) {
            let userRoles: string[][] = [];
            for (const userRole of user.rolesAdd) {
                userRoles.push([user.userId.toString(), userRole.toString()])
            }
            let userRoleResponse: MySQLResponse = await this.mySQL.insert("USERS_ROLES_CONNECTOR", ["userId", "roleId"], userRoles);
            if (userRoleResponse.error !== null)  message.push("User roles couldn't be added");
        }

        // Remove roles from user if any
        if (user.rolesRemove) {
            let userRoleWhere: Where[][] = [];
            for (const userRole of user.rolesRemove) {
                userRoleWhere.push([
                    {column: "userId", equals: [user.userId.toString()]},
                    {column: "roleId", equals: [userRole.toString()]}
                ]);
            }
            for (const where of userRoleWhere) {
                let userRoleRemoveResponse: MySQLResponse = await this.mySQL.remove("USERS_ROLES_CONNECTOR", where);
                if (userRoleRemoveResponse.error !== null)  message.push(`User roles couldn't be remove set u: ${where[0].equals}, r: ${where[1].equals}`);
            }
        }

        return message.length !== 0 ? Promise.resolve(message) : Promise.resolve(["success"]);
    }
}

export default UserEditEndpoint;