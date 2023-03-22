import EndpointBase from "../endpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Request, Response} from "express";

/**
 * Endpoint for .../api/role/user/get
 */
class UserRoleEndpoint extends  EndpointBase {
    allowedColumns: string[] = [
        "userId",
        "firstName",
        "lastName",
        "roleId",
        "roleName",
        "*"
    ];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        let select: string[] = [];
        let join: string = "";

        let allColumns: boolean = requestValues.indexOf("*") !== -1;
        let userJoinAdded: boolean = false;
        //Find all columns to find in the database
        if (requestValues.indexOf("userId")    !== -1 || allColumns) select.push("ur.userId");
        if (requestValues.indexOf("roleId") !== -1 || allColumns) select.push("ur.roleId");
        // The 2 columns below has to be retrieved from a different table, so add a join statement to query
        if (requestValues.indexOf("firstName")  !== -1 || allColumns) {
            select.push("u.firstName");
            join += " CROSS JOIN users u ON u.id=ur.userId";
            userJoinAdded = true;
        }
        if (requestValues.indexOf("lastName")  !== -1 || allColumns) {
            select.push("u.lastName");
            if (!userJoinAdded) join += " CROSS JOIN users u ON u.id=ur.userId";
        }
        if (requestValues.indexOf("roleName") !== -1 || allColumns) {
            select.push("r.name");
            join += " CROSS JOIN roles r ON r.id=ur.roleId";
        }

        //Query the data for all group that satisfies conditions
        let query: string = `SELECT ${select} FROM (SELECT * FROM users_roles_connector ${this.mySQL.createWhereString(this.createWhere(primaryKey, keyEqual))}) ur ${join}`;
        let response:MySQLResponse = await this.mySQL.sendQuery(query);
        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        return response.results;
    }

    getRoute(req: Request, res: Response) {
        //Check if tasks where specified
        let primaryKey:string = "userId";
        let requestKeys: string[] = this.urlParamsConversion(req.query.user, false);

        if (requestKeys === undefined) {
            //If not try projects
            requestKeys = this.urlParamsConversion(req.query.role, false, true, res);
            //If not return and send bad request
            if (requestKeys === undefined) { return this.badRequest(res); }
            primaryKey  = "roleId";
        }

        //Get vars if any otherwise it will get all
        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(data.status).json(data);
        })
    }
}

export default UserRoleEndpoint;