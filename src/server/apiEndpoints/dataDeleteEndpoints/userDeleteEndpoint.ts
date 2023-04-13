import GetEndpointBase from "../getEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";

class UserDeleteEndpoint extends GetEndpointBase {
    allowedColumns: string[];
    requiredRole: number = 4;

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let response: MySQLResponse = await this.mySQL.remove("USERS", [{
            column: "id", equals: keyEqual
        }]);
        if (response.error !== null) {
            return Promise.resolve([{error: "Failed to delete user"}])
        }

        return Promise.resolve([]);
    }

    public getRoute(req:Request, res:Response, primaryKey:string = "id", requestKeysName:string = "user") {
        let requestKeys: string[] = this.urlParamsConversion(req.query[requestKeysName], false, true, res);
        if (requestKeys === undefined) { return this.badRequest(res); }

        this.processRequest(req, undefined, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(data.status).json(data);
        })
    };
}

export default UserDeleteEndpoint;