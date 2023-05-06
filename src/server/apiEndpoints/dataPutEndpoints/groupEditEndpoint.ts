import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";

import "../../utility/array"

interface GroupEditData {
    managerId: number,
    groupId: number
}

interface RoleTable {
    roleId: number,
    userId: number
}

class GroupEditEndpoint extends PostEndpointBase{
    requiredRole: number = 4;

    /**
     * Edits groups connector with new manager ids
     * @param req The Request object
     * @param res The Response object
     * @return A Promise containing an array of error messages or the Array ["success"]
     */
    async submitData(req: Request, res: Response): Promise<string[]> {
        // Create a success message to return to the client
        let message: string[] = ["success"];

        // Extract the managerIds and groupIds from the request body
        let editData: GroupEditData[] = req.body;
        let managerIds: [number, number][] = editData.map(({managerId, groupId}) => [managerId, groupId]);

        // Retrieve roles of all managers with roleId == 2
        let userRolesResponse: MySQLResponse = await this.mySQL.select("USERS_ROLES_CONNECTOR", undefined, [
            {column: "userId", equals: managerIds.map(([managerId]) => managerId).toStringArray()},
            {column: "roleId", equals: ["2"]}
        ]);
        if (userRolesResponse.error !== null) throw new Error("[MySQL] Couldn't retrieve roles of managers");

        // Filter out any users that are not actually managers
        let roles: RoleTable[] = userRolesResponse.results;
        for (const [key, value] of managerIds) {
            let length: number = roles.filter(({userId}) => userId === key).length;

            // If the user is not a manager, remove it from the editData and add an error message
            if (length === 0) {
                message.push(`User ${key} isn't a manager`);
                editData = editData.filter(({managerId}) => managerId !== key);
            }
        }

        // Edit groups with their new managerIds
        await Promise.all(
            editData.map(async ({managerId, groupId}) => {
                let editResponse: MySQLResponse = await this.mySQL.update("GROUPS_CONNECTOR",
                    [{column: "managerId", value: managerId.toString()}],
                    this.createWhere("groupId", [groupId.toString()]));
                if (editResponse.error !== null) message.push(`Group ${groupId} couldn't be edited`);
            })
        );

        return Promise.resolve(message);
    }
}

export default GroupEditEndpoint;