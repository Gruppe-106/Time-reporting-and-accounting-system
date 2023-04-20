import GetEndpointBase from "../getEndpointBase";
import { Request, Response } from "express";
import { MySQLResponse } from "../../database/mysqlHandler";

class UserDeleteEndpoint extends GetEndpointBase {
    allowedColumns: string[];
    requiredRole: number = 4;

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        console.log(keyEqual)
        if (!keyEqual || keyEqual.length === 0) {
            return Promise.resolve([{ error: "No user ID provided" }]);
        }

        let response: MySQLResponse = await this.mySQL.remove("USERS", [{
            column: "id", equals: keyEqual // Pass the first element of the array
        }]);
        if (response.error !== null) {
            return Promise.resolve([{ error: "Failed to delete user" }])
        }

        return Promise.resolve([{ success: "User deleted successfully" }]);
    }



    public getRoute(req: Request, res: Response, primaryKey: string = "id", requestKeysName: string = "user") {
        let requestKeys: string[] = this.urlParamsConversion(req.query[requestKeysName], false, true, res);
        if (requestKeys === undefined) { return this.badRequest(res, req); }

        // Pass requestKeys as an array for the keyEqual parameter
        this.processRequest(req, undefined, primaryKey, requestKeys).then((data) => {

            if (!res.writableEnded) {
                res.setHeader('Content-Type', 'application/json');
                res.status(data.status).json(data);
            }

        })
    };



}


export default UserDeleteEndpoint;