import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express-serve-static-core";
import {MySQLResponse, UpdateSet} from "../../database/mysqlHandler";

interface UserTimeRegisterData {
    date          : number,
    taskId        : number,
    userId        : number,
    time         ?: number,
    approved     ?: boolean,
    managerLogged?: boolean
}

class UserTimeRegisterEndpoint extends PostEndpointBase {
    requiredRole: number = 1;

    async submitData(req: Request, res: Response): Promise<string[]> {
        let timeRegisterData: UserTimeRegisterData = req.body;

        let timeRegisterUpdateSet: UpdateSet[] = [];
        if (timeRegisterData.time)          timeRegisterUpdateSet.push({column: "time", value: timeRegisterData.time.toString()});
        if (timeRegisterData.approved)      timeRegisterUpdateSet.push({column: "approved", value: timeRegisterData.approved ? "1" : "0"});
        if (timeRegisterData.managerLogged) timeRegisterUpdateSet.push({column: "managerLogged", value: timeRegisterData.managerLogged ? "1" : "0"});

        let timeRegisterResponse: MySQLResponse = await this.mySQL.update("USERS_TASKS_TIME_REGISTER",
            timeRegisterUpdateSet,
            [
                {column: "date", equals: [this.mySQL.dateFormatter(timeRegisterData.date).replace(/..\w:.\w:.\w*/g, "")]},
                {column: "taskId", equals: [timeRegisterData.taskId.toString()]},
                {column: "userId", equals: [timeRegisterData.userId.toString()]}
            ]
        )
        if (timeRegisterResponse.error !== null) throw new Error("[MySQL] Failed to insert data");
        return Promise.resolve(["success"]);
    }
}

export default UserTimeRegisterEndpoint;