import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";

interface GroupCreationData {
    managerId: number
}

class GroupCreationEndpoint extends PostEndpointBase {
    requiredRole: number = 4;

    /**
     * Creates a new group for the specified manager
     * @param req - Express request object
     * @param res - Express response object
     * @returns Promise containing an array with a success message and the created group's ID
     */
    async submitData(req: Request, res: Response): Promise<string[]> {
        // Extract the group creation data from the request body
        let creationData: GroupCreationData = req.body;

        // Check if the manager ID is missing
        if (creationData.managerId === undefined) return ["Missing manger id"];

        // Verify that the user has the manager role
        let userRoleResponse: MySQLResponse = await  this.mySQL.select("USERS_ROLES_CONNECTOR", ["roleId"], [
            {column: "userId", equals: [creationData.managerId.toString()]},
            {column: "roleId", equals: ["2"]}
        ]);
        if (userRoleResponse.error !== null || userRoleResponse.results.length === 0) throw new Error("Couldn't verify user role");

        // Create a new group with the specified manager
        let groupCreationResponse: MySQLResponse = await this.mySQL.insert("GROUPS_CONNECTOR", ["managerId"], [creationData.managerId.toString()]);
        if (groupCreationResponse.error !== null) throw new Error("Failed to add group");
        let groupId: number = groupCreationResponse.results.insertId;

        // Return a success message and the ID of the created group
        return Promise.resolve(["success", groupId.toString()]);

    }

}

export default GroupCreationEndpoint;