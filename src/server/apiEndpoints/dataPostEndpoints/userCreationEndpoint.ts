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

class UserCreationEndpoint extends PostEndpointBase {
    requiredRole: number = 4;

    allowedColumns: string[];

    async submitData(req: Request, res: Response): Promise<string[]> {
        //Get data from the user creation form
        let user: UserCreationData = req.body;

        // Input validate email address
        const emailValid:boolean = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
        if (emailValid) return Promise.resolve(["Email not valid"]);

        // Get the group id the manager presides over
        let groupResponse: MySQLResponse = await this.mySQL.select("groups_connector", ["groupId"], {column: "managerId", equals: [user.manager.toString()]})
        if (groupResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");
        let groupId = groupResponse.results[0].groupId;

        let userResponse: MySQLResponse = await this.mySQL.insert("users",
            ["email", "firstName", "lastName", "groupId"],
            [user.email, user.firstName, user.lastName, groupId.toString()])
        if (userResponse.error !== null) throw new Error("[MySQL] Failed insert data");
        let userId: number = userResponse.results.insertId

        // Make a list of all user roles to add to connector
        let userRoles: string[][] = [];
        for (const userRole of user.roles) {
            userRoles.push([userId.toString(), userRole.toString()])
        }

        // Append all roles the user has to the user role connector table
        let userRoleResponse: MySQLResponse = await this.mySQL.insert("users_roles_connector", ["userId", "roleId"], userRoles);
        if (userRoleResponse.error !== null) throw new Error("[MySQL] Failed insert data");

        // Add user to the authentication table
        let authKey: AuthKey = authKeyCreate(userId);
        let authResponse: MySQLResponse = await this.mySQL.insert("auth",
            ["email", "authKey", "authKeyEndDate", "userId", "password"],
            [user.email, authKey.key, this.mySQL.dateFormatter(authKey.valid), userId.toString(), user.password]);
        if (authResponse.error !== null) throw new Error("[MySQL] Failed insert data");

        return Promise.resolve(["success"]);
    }
}

export default UserCreationEndpoint;