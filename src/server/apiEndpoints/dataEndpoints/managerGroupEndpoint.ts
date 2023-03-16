import {User} from "../endpointBase";
import {USERS} from "../../database/fakeData/USERS";
import {Request, Response} from "express";
import EndpointConnectorBase from "../endpointConnectorBase";
import {GROUP} from "../../database/fakeData/GROUP";
import {UserEndpoint, UserReturnType} from "./userEndpoint";

interface ReturnType {
    manager?: number,
    first_name?: string,
    last_name?: string,
    group?: number,
    employees?: {
        id?: number,
        first_name?: string,
        last_name?: string,
        email?: string
    }[];
}

export class ManagerGroupEndpoint extends EndpointConnectorBase {
    table = new USERS().data;
    tableSecond = null;
    tableConnector = new GROUP().data;
    data: ReturnType[];

    async getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        let userEndpoint = new UserEndpoint(user);
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.tableConnector) {
            if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1 || keyEqual.indexOf("*") !== -1) {
                this.data[dataIndex] = {};
                if (requestValues.indexOf("*") !== -1) {
                    this.data[dataIndex].employees   = [];
                    let employees:UserReturnType[] = await userEndpoint.processRequest(["id", "first_name", "last_name", "group"], "id", ["*"]);
                    for (const value of employees) {
                        if (value.id === entry.manager) {
                            this.data[dataIndex].first_name = value.first_name;
                            this.data[dataIndex].last_name = value.last_name;
                        }
                        else if(value.group === entry.id) {
                            this.data[dataIndex].employees.push({
                                id: value.id,
                                first_name: value.first_name,
                                last_name: value.last_name,
                                email: value.last_name
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
                            case "first_name":
                                let dataFirst:UserReturnType[]  = await userEndpoint.processRequest(["first_name"], "id", [entry.manager.toString()]);
                                this.data[dataIndex].first_name = dataFirst.pop().first_name;
                                break;
                            case "last_name":
                                let dataLast:UserReturnType[]  = await userEndpoint.processRequest(["last_name"], "id", [entry.manager.toString()]);
                                this.data[dataIndex].first_name = dataLast.pop().first_name;
                                break;
                            case "employees":
                                this.data[dataIndex].employees   = [];
                                let employees:UserReturnType[] = await userEndpoint.processRequest(["id", "first_name", "last_name", "group"], "id", ["*"]);
                                for (const value of employees) {
                                    if(value.group === entry.id) {
                                        this.data[dataIndex].employees.push({
                                            id: value.id,
                                            first_name: value.first_name,
                                            last_name: value.last_name,
                                            email: value.last_name
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