import _endpointBase from "../_endpointBase";
import {Request, Response} from "express";
import {USER_ROLES_CONNECTOR} from "../../database/fakeData/USER_ROLES_CONNECTOR";
import {UserEndpointOld, UserReturnType} from "./userEndpoint";
import {RoleEndpointOld, RoleReturnType} from "./roleEndpoint";

export interface UserRoleReturnType {
    userId?: number,
    firstName?: string,
    lastName?: string,
    roleId?: number,
    roleName?: string
}

interface EntryType {
    role: number,
    user: number
}

export class UserRoleEndpointOld extends _endpointBase {
    table = USER_ROLES_CONNECTOR.data;
    data: UserRoleReturnType[] = [];

    private async getAllDataForKey(dataIndex:number, entry:EntryType) {
        this.data[dataIndex].userId    = entry.user;
        let task: UserReturnType[]     = await new UserEndpointOld(this.user).processRequest(["firstName", "lastName"], "id", [(entry.user).toString()]);
        this.data[dataIndex].firstName = task[0].firstName;
        this.data[dataIndex].lastName  = task[0].lastName;
        this.data[dataIndex].roleId    = entry.role;
        let role: RoleReturnType[]     = await new RoleEndpointOld(this.user).processRequest(["name"], "id", [entry.role.toString()]);
        this.data[dataIndex].roleName  = role[0].name;
    }

    private async getSpecificDataForKey(requestValues: string[], dataIndex:number, entry:EntryType) {
        //Check user data to consolidate to one call of the UserEndpoint
        let userData: UserReturnType[];
        let userValues: string[] = [];
        if (requestValues.indexOf("firstName") !== -1) userValues.push("firstName");
        if (requestValues.indexOf("lastName") !== -1)   userValues.push("lastName");
        if (userValues.length > 0) {
            userData = await new UserEndpointOld(this.user).processRequest(userValues, "id", [(entry.user).toString()]);
        }

        //Go through all requested values and them to the returning data
        for (const request of requestValues) {
            if (request === "userId")         this.data[dataIndex].userId = entry.user;
            else if (request === "firstName") this.data[dataIndex].firstName = userData[0].firstName;
            else if (request === "lastName")  this.data[dataIndex].lastName  = userData[0].lastName;
            else if (request === "roleId")    this.data[dataIndex].roleId = entry.role;
            else if (request === "roleName")  {
                let role: RoleReturnType[]     = await new RoleEndpointOld(this.user).processRequest(["name"], "id", [entry.role.toString()]);
                this.data[dataIndex].roleName  = role[0].name;
            }
        }
    }

    public async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        let dataIndex = 0;
        for (const entry of this.table) {
            if (this.table.length >= entry.user && entry[primaryKey] !== undefined) {
                if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1 || keyEqual.indexOf("*") !== -1) {
                    this.data[dataIndex] = {};
                    if (requestValues.indexOf("*") !== -1) {
                        await this.getAllDataForKey(dataIndex, entry);
                    } else {
                        await this.getSpecificDataForKey(requestValues, dataIndex, entry);
                    }
                    dataIndex++;
                }
            }
        }
        return this.data;
    }

    public getRoute(req:Request, res:Response) {
        let primaryKey:string = "user";
        let requestKeys: string[] = this.urlParamsConversion(req.query.user, false);

        if (requestKeys === undefined) {
            requestKeys = this.urlParamsConversion(req.query.role, false, true, res);
            if (requestKeys === undefined) { return; }
            primaryKey  = "role";
        }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(data);
        })
    }
}