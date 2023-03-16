import EndpointBase, {User} from "../endpointBase";
import {Request, Response} from "express";
import {GROUP} from "../../database/fakeData/GROUP";
import {UserEndpoint, UserReturnType} from "./userEndpoint";

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

/*
    table = USERS.data;
    tableConnector = GROUP.data;
 */
export class ManagerGroupEndpoint extends EndpointBase {
    table = GROUP.data;
    data: ManagerGroupReturnType[];

    async getData(requestValues: string[], primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        let userEndpoint = new UserEndpoint(this.user);
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.table) {
            if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1 || keyEqual.indexOf("*") !== -1) {
                this.data[dataIndex] = {};
                if (requestValues.indexOf("*") !== -1) {
                    this.data[dataIndex].employees   = [];
                    let employees:UserReturnType[] = await userEndpoint.processRequest(["id", "firstName", "lastName", "group"], "id", ["*"]);
                    for (const value of employees) {
                        if (value.id === entry.manager) {
                            this.data[dataIndex].firstName = value.firstName;
                            this.data[dataIndex].lastName = value.lastName;
                        }
                        else if(value.group === entry.id) {
                            this.data[dataIndex].employees.push({
                                id: value.id,
                                firstName: value.firstName,
                                lastName: value.lastName,
                                email: value.lastName
                            })
                        }
                    }
                    this.data[dataIndex].manager = entry.manager;
                    this.data[dataIndex].group = entry.id;
                } else {
                    console.log(requestValues)
                    for (const request of requestValues) {
                        switch (request) {
                            case "manager":
                                this.data[dataIndex].manager = entry.manager;
                                break;
                            case "group":
                                this.data[dataIndex].group = entry.id;
                                break;
                            case "firstName":
                                let dataFirst:UserReturnType[]  = await userEndpoint.processRequest(["firstName"], "id", [entry.manager.toString()]);
                                this.data[dataIndex].firstName = dataFirst.pop().firstName;
                                break;
                            case "lastName":
                                let dataLast:UserReturnType[]  = await userEndpoint.processRequest(["lastName"], "id", [entry.manager.toString()]);
                                this.data[dataIndex].firstName = dataLast.pop().firstName;
                                break;
                            case "employees":
                                this.data[dataIndex].employees   = [];
                                let employees:UserReturnType[] = await userEndpoint.processRequest(["id", "firstName", "lastName", "group"], "id", ["*"]);
                                for (const value of employees) {
                                    if(value.group === entry.id) {
                                        this.data[dataIndex].employees.push({
                                            id: value.id,
                                            firstName: value.firstName,
                                            lastName: value.lastName,
                                            email: value.lastName
                                        })
                                    }
                                }
                                break;
                            default: break;
                        }
                    }
                }
                dataIndex++;
            }
        }
        return this.data;
    }
}

export function managerGroupGetRoute(req:Request, res:Response, user:User) {
    let managerIds = req.query.manager;
    let groupIds = req.query.group;
    let values = req.query.var;

    let requestedValues:string[];
    if (typeof values === "string" ) {
        requestedValues = values.split(",");
    } else {
        requestedValues = ["*"];
    }

    let primaryKey:string = "";
    let requestKeys: string[];

    if (typeof managerIds === "string") {
        requestKeys= managerIds.split(",");
        primaryKey = "manager";
    } else if (typeof groupIds === "string") {
        requestKeys= groupIds.split(",");
        primaryKey = "id";
    } else {
        res.sendStatus(400)
        res.end();
        return;
    }

    let managerGroupEndpoint = new ManagerGroupEndpoint(user);
    managerGroupEndpoint.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);
    })
}