import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";

interface GroupCreationData {
    managerId: number
}

class GroupCreationEndpoint extends PostEndpointBase {
    requiredRole: number = 4;

    async submitData(req: Request, res: Response): Promise<string[]> {
        let creationData: GroupCreationData = req.body;
        if (creationData.managerId === undefined) return ["Missing manger id"];

        let userRoleResponse: MySQLResponse = await  this.mySQL.select("USERS_ROLES_CONNECTOR", ["roleId"], [
            {column: "userId", equals: [creationData.managerId.toString()]},
            {column: "roleId", equals: ["2"]}
        ]);
        if (userRoleResponse.error !== null || userRoleResponse.results.length === 0) throw new Error("Couldn't verify user role");

        let groupCreationResponse: MySQLResponse = await this.mySQL.insert("GROUPS_CONNECTOR", ["managerId"], [creationData.managerId.toString()]);
        if (groupCreationResponse.error !== null) throw new Error("Failed to add group");
        let groupId: number = groupCreationResponse.results.insertId;

        return Promise.resolve(["success", groupId.toString()]);
    }

}

export default GroupCreationEndpoint;