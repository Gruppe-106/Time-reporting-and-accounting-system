import GetEndpointBase from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Request, Response} from "express";

interface ManagerGroupReturnType {
    managerId?: number,
    firstName?: string,
    lastName?: string,
    groupId: number,
    employees?: {
        id?: number,
        firstName?: string,
        lastName?: string,
        email?: string
    }[];
}

export interface UserReturnType {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    groupId: number
}

/**
 * Endpoint for .../api/group/manager/get
 */
class ManagerGroupEndpoint extends GetEndpointBase {
    requiredRole: number = 1;

    //Not used, but required by base class
    allowedColumns: string[];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?: string[]): Promise<object[]> {
        //A where condition is needed if specific managers or groups is specified
        let where: string = keyEqual.indexOf("*") !== -1 ? "" : `WHERE ${primaryKey} IN (${keyEqual})`

        let allColumns: boolean = requestValues.indexOf("*") !== -1;

        //Find all columns to find in the database
        let join: string = "";
        let select: string[] = ["g.groupId"];
        if (requestValues.indexOf("managerId") !== -1 || allColumns) select.push("g.managerId");
        // The 2 columns below has to be retrieved from a different table, so add a join statement to query
        if (requestValues.indexOf("firstName") !== -1 || allColumns) {
            select.push("u.firstName");
            join = "CROSS JOIN users u ON u.id=g.managerId";
        }
        if (requestValues.indexOf("lastName")  !== -1 || allColumns) {
            select.push("u.lastName");
            join = "CROSS JOIN users u ON u.id=g.managerId";
        }

        //Query the data for all group that satisfies conditions
        let query: string = `SELECT ${select} FROM ((SELECT * FROM groups_connector ${where}) g ${join}) ORDER BY groupId`;
        let response:MySQLResponse = await this.mySQL.sendQuery(query);
        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        let results: ManagerGroupReturnType[] = response.results;

        //Ensure the data sent to client has the correct layout
        let finalResult: ManagerGroupReturnType[] = [];
        for (const result of results) {
            finalResult.push({
                managerId: result.managerId,
                firstName: result.firstName,
                lastName:  result.lastName,
                groupId:   result.groupId,
                employees: []
            })
        }

        //Add employees if requested
        if (requestValues.indexOf("employees") !== -1 || allColumns) {
            //Find all group ids to find employees for
            let groupId: number[] = [];
            for (const result of finalResult) {
                groupId.push(result.groupId);
            }

            //Send query to get all employees with a group id found above
            let employeeQuery: string = `SELECT id,firstName,lastName,email,groupId from users WHERE groupId IN (${groupId}) ORDER BY groupId`;
            let employeeResponse:MySQLResponse = await this.mySQL.sendQuery(employeeQuery);
            if (employeeResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");

            //Loop through all employees and add them to the correct group
            let employeeResult: UserReturnType[] = employeeResponse.results;
            let mainIndex = 0;
            for (const user of employeeResult) {
                //Get the correct index for the specific user, as the list of users & group is sorted by groupId it's fine to just increment until correct
                for (;finalResult[mainIndex].groupId !== user.groupId; mainIndex++);
                //Add the employee to the group
                finalResult[mainIndex].employees.push({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                })
            }
        }
        return finalResult;
    }

    getRoute(req: Request, res: Response) {
        //Check if managers are specified
        let primaryKey:string = "managerId";
        let requestKeys: string[] = this.urlParamsConversion(req.query.manager, false);

        if (requestKeys === undefined) {
            //If managers wasn't specified check if groups where
            requestKeys = this.urlParamsConversion(req.query.group, false, true, res);
            //If not return and send bad request
            if (requestKeys === undefined) { return this.badRequest(res); }
            primaryKey  = "groupId";
        }

        //Get vars if any otherwise it will get all
        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(req, requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(data.status).json(data);
        })
    }
}

export default ManagerGroupEndpoint;