import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";

interface GroupEditData {
    managerId: number,
    groupId: number
}

class GroupEditEndpoint extends PostEndpointBase{
    requiredRole: number = 4;

    async submitData(req: Request, res: Response): Promise<string[]> {
        let message: string[] = ["success"];
        let editData: GroupEditData[] = req.body;

        for (const edit of editData) {
            let editResponse: MySQLResponse = await this.mySQL.update("GROUPS_CONNECTOR",
                [{column: "managerId", value: edit.managerId.toString()}],
                this.createWhere("groupId", [edit.groupId.toString()]));
            if (editResponse.error !== null) message.push(`Group ${edit.groupId} couldn't be edited`)
        }

        return Promise.resolve(message);
    }
}

export default GroupEditEndpoint;