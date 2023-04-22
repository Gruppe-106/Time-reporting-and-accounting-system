import getEndpointBase, { PrimaryKeyType } from "../getEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";

class UserTaskProjectEndpoint extends getEndpointBase {
    urlPrimaryKey: PrimaryKeyType[];
    allowedColumns: string[];
    requiredRole: number = 1;

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let query: string = `SELECT t.name AS taskName,t.id AS taskId,p.id AS projectId,p.name AS projectName  FROM (SELECT * FROM USERS_TASKS_CONNECTOR WHERE userId IN ('${keyEqual[0]}')) utc`;
        query += ` CROSS JOIN TASKS t ON t.id=utc.taskId`;
        query += ` CROSS JOIN TASKS_PROJECTS_CONNECTOR tpc ON tpc.taskId=utc.taskId`;
        query += ` CROSS JOIN PROJECTS p ON p.id=tpc.projectId`;
        let response: MySQLResponse = await this.mySQL.sendQuery(query);
        if (response.error !== null) throw new Error("Failed to load data");
        return Promise.resolve(response.results);
    }

    getRoute(req: Request, res: Response, primaryKey: string = "userId", requestKeysName: string = "user"): void {
        let requestKeys: string[] = this.urlParamsConversion(req.query[requestKeysName], false, true, res);
        if (requestKeys === undefined) { return this.badRequest(res, req); }

        this.processRequest(req, [], primaryKey, requestKeys).then((data) => {
            if (!res.writableEnded) {
                res.setHeader('Content-Type', 'application/json');
                res.status(data.status).json(data);
            }
        })
    }
}

export default UserTaskProjectEndpoint;