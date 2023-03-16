import EndpointBase, {User} from "../endpointBase";
import {Request, Response} from "express";
import {USER_ROLES_CONNECTOR} from "../../database/fakeData/USER_ROLES_CONNECTOR";
import {UserEndpoint, UserReturnType} from "./userEndpoint";
import {RoleEndpoint, RoleReturnType} from "./roleEndpoint";

export interface UserRoleReturnType {
    userId?: number,
    firstName?: string,
    lastName?: string,
    roleId?: number,
    roleName?: string
}

export class UserRoleEndpoint extends EndpointBase {
    table = USER_ROLES_CONNECTOR.data;
    data: UserRoleReturnType[];

    async getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.table) {
            if (this.table.length >= entry.user) {
                if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1 || keyEqual.indexOf("*") !== -1) {
                    this.data[dataIndex] = {};
                    if (requestValues.indexOf("*") !== -1) {
                        this.data[dataIndex].userId    = entry.user;
                        let task: UserReturnType[]     = await new UserEndpoint(user).processRequest(["firstName", "lastName"], "id", [(entry.user - 1).toString()]);
                        this.data[dataIndex].firstName = task[0].firstName;
                        this.data[dataIndex].lastName  = task[0].lastName;
                        this.data[dataIndex].roleId    = entry.role;
                        let role: RoleReturnType[]     = await new RoleEndpoint(user).processRequest(["name"], "id", [entry.role.toString()]);
                        this.data[dataIndex].roleName  = role[0].name;
                    } else {
                        let userData: UserReturnType[];
                        let userValues: string[] = [];
                        if (requestValues.indexOf("firstName") !== -1) userValues.push("firstName");
                        if (requestValues.indexOf("lastName") !== -1)   userValues.push("lastName");
                        if (userValues.length > 0) {
                            userData = await new UserEndpoint(user).processRequest(userValues, "id", [(entry.user - 1).toString()]);
                        }
                        for (const request of requestValues) {
                            if (request === "userId")         this.data[dataIndex].userId = entry.user;
                            else if (request === "firstName") this.data[dataIndex].firstName = userData[0].firstName;
                            else if (request === "lastName")  this.data[dataIndex].lastName  = userData[0].lastName;
                            else if (request === "roleId")    this.data[dataIndex].roleId = entry.role;
                            else if (request === "roleName")  {
                                let role: RoleReturnType[]     = await new RoleEndpoint(user).processRequest(["name"], "id", [entry.role.toString()]);
                                this.data[dataIndex].roleName  = role[0].name;
                            }
                        }
                    }
                    dataIndex++;
                }
            }
        }
        return this.data;
    }
}

export function userRoleGetRoute(req:Request, res:Response, user:User) {
    let userIds = req.query.user;
    let roleIds = req.query.role;
    let values = req.query.var;

    let requestedValues:string[];
    if (typeof values === "string" ) {
        requestedValues = values.split(",");
    } else {
        requestedValues = ["*"];
    }

    let primaryKey:string = "";
    let requestKeys: string[];

    if (typeof userIds === "string") {
        requestKeys= userIds.split(",");
        primaryKey = "user";
    } else if (typeof roleIds === "string") {
        requestKeys= roleIds.split(",");
        primaryKey = "role";
    } else {
        res.sendStatus(400)
        res.end();
        return;
    }

    let userRoleEndpoint = new UserRoleEndpoint(user);
    userRoleEndpoint.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);
    })
}