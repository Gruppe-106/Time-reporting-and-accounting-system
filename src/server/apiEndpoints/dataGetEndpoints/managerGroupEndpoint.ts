import EndpointBase from "../endpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Request, Response} from "express";

/**
 * Endpoint for .../api/group/manager/get
 */
class ManagerGroupEndpoint extends  EndpointBase {
    allowedColumns: string[] = [
        "taskId",
        "taskName",
        "projectId",
        "projectName",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let employeeQuery: string = `SELECT id,firstName,lastName,email from users on users.groupId=g.groupId`;
        let query: string = `SELECT g.managerId,g.groupId,u.firstName,u.lastName FROM groups_connector g CROSS JOIN users u ON u.id=g.managerId`;

        let response:MySQLResponse = await this.mySQL.sendQuery(query);
        //let employeeResponse:MySQLResponse = await this.mySQL.sendQuery(employeeQuery);

        if (response.error !== null) return [{error: "Failed to retrieve data"}];

        return response.results;
    }

    getRoute(req: Request, res: Response) {
        let primaryKey:string = "managerId";
        let requestKeys: string[] = this.urlParamsConversion(req.query.manager, false);

        if (requestKeys === undefined) {
            requestKeys = this.urlParamsConversion(req.query.group, false, true, res);
            if (requestKeys === undefined) { return; }
            primaryKey  = "groupId";
        }

        //Not allowed to get all, so remove that from the list
        requestKeys = requestKeys.filter((value:string) => { if (value !== "*") return value});
        if (requestKeys.length === 0) { return this.badRequest(res); }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(data.status).json(data);
        })
    }
}

export default ManagerGroupEndpoint;