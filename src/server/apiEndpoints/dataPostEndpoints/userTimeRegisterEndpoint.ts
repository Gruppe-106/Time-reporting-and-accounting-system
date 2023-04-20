import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express-serve-static-core";
import {MySQLResponse} from "../../database/mysqlHandler";

interface UserTimeRegisterData {
    date   : number,
    taskId : number,
    userId : number,
    time   : number,
}

interface TimeRegisterGetData {
    approved: boolean,
    managerLogged: boolean
}

class UserTimeRegisterEndpoint extends PostEndpointBase {
    requiredRole: number = 1;

    async submitData(req: Request, res: Response): Promise<string[]> {
        let timeRegisterData: UserTimeRegisterData = req.body;

        if (timeRegisterData.userId === undefined || timeRegisterData.taskId === undefined || timeRegisterData.date === undefined) return ["Missing data"];

        // First check if the time register already exists in the DB
        let timeRegisterGetResponse: MySQLResponse = await this.mySQL.select("USERS_TASKS_TIME_REGISTER", ["approved", "managerLogged"], [
            {column: "userId", equals: [timeRegisterData.userId.toString()]},
            {column: "taskId", equals: [timeRegisterData.taskId.toString()]},
            {column: "date",   equals: [this.mySQL.dateFormatter(timeRegisterData.date)]}
        ])
        let timeRegisterGetResult: TimeRegisterGetData[] = timeRegisterGetResponse.results;

        // If not add the data to DB otherwise do nothing
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
        } else {
            return Promise.resolve(["Registration already exists, use edit instead"]);
        }

        return Promise.resolve(["success"]);
    }
}

export default UserTimeRegisterEndpoint;