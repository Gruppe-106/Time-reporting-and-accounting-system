import EndpointBase from "../endpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Request, Response} from "express";

/**
 * Endpoint for .../api/role/get
 */
class UserEndpoint extends  EndpointBase {
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
        if (response.error !== null) return [{error: "Failed to retrieve data"}];

        return response.results;
    }

    public getRoute(req:Request, res:Response) {
        let primaryKey:string = "id";
        let requestKeys: string[] = this.urlParamsConversion(req.query.ids, false);
        if (requestKeys === undefined) {
            requestKeys = this.urlParamsConversion(req.query.emails, false, true, res);
            if (requestKeys === undefined) { return; }
            primaryKey = "email";
        }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(data.status).json(data.data);
        })
    };
}

export default UserEndpoint;