import {User} from "../endpointBase";
import {USERS} from "../../database/fakeData/USERS";
import {Request, Response} from "express";
import {USER_ROLES_CONNECTOR} from "../../database/fakeData/USER_ROLES_CONNECTOR";
import EndpointConnectorBase from "../endpointConnectorBase";
import {ROLES} from "../../database/fakeData/ROLES";

interface ReturnType {
    taskId?: number,
    taskName?: string,
    projectName?: string,
    projectId?: number
    date?: number,
    userId?: number,
    time?: number
    approved?: boolean
    managerLogged?: boolean
}

export class UserRoleEndpoint extends EndpointConnectorBase {
    table = new USERS().data;
    tableSecond = new ROLES().data;
    tableConnector = new USER_ROLES_CONNECTOR().data;
    data: ReturnType[];

    private getRoleName(entry:{role: number, user: number}, dataIndex:number) {
        let name:{id: number, name: string}[] = this.tableSecond.filter((value) => {
            if (value.id === entry.role) {
                return value;
            }
        })
        if (name.length !== 0) {
            this.data[dataIndex].roleName = name[0].name;
        }
    }

    async getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]): Promise<object[]> {
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.tableConnector) {
            if (this.table.length >= entry.user) {
                if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1 || keyEqual.indexOf("*") !== -1) {
                    this.data[dataIndex] = {};
                    if (requestValues.indexOf("*") !== -1) {
                        this.getRoleName(entry, dataIndex);
                        this.data[dataIndex].roleId = entry.role;
                        this.data[dataIndex].userId = entry.user;
                        this.data[dataIndex].firstName = this.table[entry.user - 1].firstName;
                        this.data[dataIndex].lastName = this.table[entry.user - 1].lastName;
                    } else {
                        console.log(requestValues)
                        for (const request of requestValues) {
                            if (request === "roleId") this.data[dataIndex].roleId = entry.role;
                            else if (request === "userId") this.data[dataIndex].userId = entry.user;
                            else if (request === "roleName") this.getRoleName(entry, dataIndex);
                            else if (request === "firstName") this.data[dataIndex].firstName = this.table[entry.user - 1].firstName;
                            else if (request === "lastName") this.data[dataIndex].lastName = this.table[entry.user - 1].lastName;
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