import GetEndpointBase, {PrimaryKeyType} from "../getEndpointBase";
import {MySQLResponse} from "../../database/mysqlHandler";
import MysqlQueryBuilder, {MySQLJoinTypes} from "../../database/mysqlStringBuilder";

/**
 * Structure of data returned to client
 */
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

/**
 * Structure of user data retrieved from database
 */
export interface UserDataType {
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
    urlPrimaryKey: PrimaryKeyType[] = [
        {urlKey: "manager", mysqlKey: "managerId", allowAll: false, throwOnMissing: false},
        {urlKey: "group", mysqlKey: "groupId", allowAll: false, throwOnMissing: true}
    ];
    requiredRole: number = 1;

    /**
     * Retrieves data for manager group and optionally all employees in group
     * @param requestValues Columns to get data from
     * @param primaryKey The primary key to match
     * @param keyEqual What the primary key should match
     * @returns array of objects containing manager group data, see ManagerGroupReturnType for details
     */    
    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        //A where condition is needed if specific managers or groups is specified
        let allColumns: boolean = requestValues.indexOf("*") !== -1;

        let query: string = this.createQuery(keyEqual, allColumns, primaryKey, requestValues);

        //Query the data for all group that satisfies conditions
        let response:MySQLResponse = await this.mySQL.sendQuery(query);

        //Check if there was an error and throw if so
        if (response.error !== null) throw new Error("[MySQL] Failed to retrieve data");
        let results: ManagerGroupReturnType[] = response.results;

        if (results.length === 0) return [{error: "Failed to get data, couldn't find group"}];
        //Ensure the data sent to client has the correct layout
        let finalResult: ManagerGroupReturnType[] = results.map(result => ({
            managerId: result.managerId,
            firstName: result.firstName,
            lastName:  result.lastName,
            groupId:   result.groupId,
            employees: []
        }));

        //Add employees if requested
        if (requestValues.indexOf("employees") !== -1 || allColumns) {
            finalResult = await this.getEmployeeData(finalResult);
        }

        return finalResult;
    }

    /**
     * Creates a MySQL query to retrieve data for manager group and optionally all employees in group
     * @param keyEqual What the primary key should match
     * @param allColumns Whether to retrieve all columns
     * @param primaryKey The primary key to match
     * @param requestValues Columns to get data from
     * @returns MySQL query string
     */
    private createQuery(keyEqual: string[], allColumns: boolean, primaryKey: string, requestValues: string[]) {
        // Check if a where condition is needed
        let where: [key: string, equals: string[]] = undefined;
        if (keyEqual !== undefined && allColumns)
            where = [primaryKey, keyEqual];

        // Create a MySQL query builder
        let mysqlBuilder: MysqlQueryBuilder = new MysqlQueryBuilder()
            .from("GROUPS_CONNECTOR", where, undefined, "g")
            .addColumnsToGet(["g.groupId as groupId"]);

        // Add columns to retrieve from GROUPS_CONNECTOR table
        if (requestValues.indexOf("managerId") !== -1 || allColumns) mysqlBuilder.addColumnsToGet(["g.managerId as managerId"]);

        // Add columns to retrieve from USERS table
        if (requestValues.indexOf("firstName") !== -1 || allColumns) {
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "USERS", ["u.id", "g.managerId"], "u")
                .addColumnsToGet(["u.firstName as firstName"]);
        }
        if (requestValues.indexOf("lastName") !== -1 || allColumns) {
            mysqlBuilder.join(MySQLJoinTypes.CROSS, "USERS", ["u.id", "g.managerId"], "u")
                .addColumnsToGet(["u.lastName as lastName"]);
        }

        // Return the MySQL query string
        return mysqlBuilder.build();
    }


    /**
     * Retrieves employee data for a manager group
     * @param finalResult An array of objects containing manager group data
     * @returns An array of objects containing manager group data with employees added
     */
    private async getEmployeeData(finalResult: ManagerGroupReturnType[]) {
        //Find all group ids to find employees for
        let groupIds: number[] = [];
        for (const result of finalResult) {
            groupIds.push(result.groupId);
        }
        //Send query to get all employees with a group id found above
        let employeeQuery: string = `SELECT * from USERS WHERE groupId IN (${groupIds}) ORDER BY groupId`;
        let employeeResponse: MySQLResponse = await this.mySQL.sendQuery(employeeQuery);
        if (employeeResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");
        //Loop through all employees and add them to the correct group
        let employeeResult: UserDataType[] = employeeResponse.results;
        let mainIndex = 0;
        for (const user of employeeResult) {
            if (user.groupId === undefined) continue
            //Get the correct index for the specific user, as the list of users & group is sorted by groupId it's fine to just increment until correct
            for (; finalResult[mainIndex].groupId !== user.groupId; mainIndex++) ;
            //Add the employee to the group
            finalResult[mainIndex].employees.push({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            })
        }
        return finalResult;
    }

}

export default ManagerGroupEndpoint;