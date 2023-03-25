import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Request, Response} from "express";

/**
 * Endpoint for .../api/role/get
 */
class UserEndpoint extends  GetEndpointBase {
    requiredRole: number = 1;

    allowedColumns: string[] = [
        "id",
        "email",
        "firstName",
        "lastName",
        "groupId",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let response:MySQLResponse = await this.mySQL.select("users", this.createColumns(requestValues), this.createWhere(primaryKey, keyEqual));
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }

    public getRoute(req:Request, res:Response) {
        let primaryKey:string = "id";
        let requestKeys: string[] = this.urlParamsConversion(req.query.ids, false);
        if (requestKeys === undefined) {
            requestKeys = this.urlParamsConversion(req.query.emails, false, true, res);
            if (requestKeys === undefined) { return this.badRequest(res); }
            primaryKey = "email";
        }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(req, requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(data.status).json(data.data);
        })
    };
}

export default UserEndpoint;