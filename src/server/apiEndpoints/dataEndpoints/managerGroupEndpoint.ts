import _endpointBase from "../_endpointBase";
import {Request, Response} from "express";
import {GROUP} from "../../database/fakeData/GROUP";
import {UserEndpointOld, UserReturnType} from "./userEndpoint";

interface ManagerGroupReturnType {
    manager?: number,
    firstName?: string,
    lastName?: string,
    group?: number,
    employees?: {
        id?: number,
        firstName?: string,
        lastName?: string,
        email?: string
    }[];
}

interface EntryType {
    manager: number,
    id: number
}

export class ManagerGroupEndpointOld extends _endpointBase {
    table = GROUP.data;
    data: ManagerGroupReturnType[];

    private async getAllDataForKey(dataIndex:number, entry:EntryType) {
        this.data[dataIndex].employees = [];
        let users:UserReturnType[] = await new UserEndpointOld(this.user).processRequest(["id", "firstName", "lastName", "email"], "group", [entry.id.toString()]);
        users.forEach((value) => {
            this.data[dataIndex].employees.push({
                id: value.id,
                firstName: value.firstName,
                lastName: value.lastName,
                email: value.email
            })
        })

        let manager:UserReturnType[]   = await new UserEndpointOld(this.user).processRequest(["firstName", "lastName"], "id", [entry.manager.toString()]);
        this.data[dataIndex].firstName = manager[0].firstName;
        this.data[dataIndex].lastName  = manager[0].lastName;
        this.data[dataIndex].manager   = entry.manager;
        this.data[dataIndex].group     = entry.id;
    }

    private async getSpecificDataForKey(requestValues: string[], dataIndex:number, entry:EntryType) {
        let managerData: UserReturnType[];
        let managerValues: string[] = [];
        if (requestValues.indexOf("firstName") !== -1)  managerValues.push("firstName");
        if (requestValues.indexOf("lastName") !== -1)   managerValues.push("lastName");
        if (managerValues.length > 0) {
            managerData = await new UserEndpointOld(this.user).processRequest(managerValues, "id", [entry.manager.toString()]);
        }
        for (const request of requestValues) {
            switch (request) {
                case "manager":
                    this.data[dataIndex].manager = entry.manager;
                    break;
                case "group":
                    this.data[dataIndex].group = entry.id;
                    break;
                case "firstName":
                    this.data[dataIndex].firstName = managerData[0].firstName;
                    break;
                case "lastName":
                    this.data[dataIndex].firstName = managerData[0].firstName;
                    break;
                case "employees":
                    this.data[dataIndex].employees = await new UserEndpointOld(this.user).processRequest(["id", "firstName", "lastName", "group"], "group", [entry.id.toString()]);
                    break;
                default: break;
            }
        }
    }

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.table) {
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
        return this.data;
    }

    getRoute(req: Request, res: Response) {
        let primaryKey:string = "manager";
        let requestKeys: string[] = this.urlParamsConversion(req.query.manager, false);

        if (requestKeys === undefined) {
            requestKeys = this.urlParamsConversion(req.query.group, false, true, res);
            if (requestKeys === undefined) { return; }
            primaryKey  = "id";
        }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(data);
        })
    }
}