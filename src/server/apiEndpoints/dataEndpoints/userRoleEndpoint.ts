import {User} from "../endpointBase";
import {USERS} from "../../database/fakeData/USERS";
import {Request, Response} from "express";
import {USER_ROLES_CONNECTOR} from "../../database/fakeData/USER_ROLES_CONNECTOR";
import EndpointConnectorBase from "../endpointConnectorBase";
import {ROLES} from "../../database/fakeData/ROLES";

interface ReturnType {
    user_id?: number,
    first_name?: string,
    last_name?: string,
    role_id?: number,
    role_name?: string
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
            this.data[dataIndex].role_name = name[0].name;
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
                        this.data[dataIndex].role_id = entry.role;
                        this.data[dataIndex].user_id = entry.user;
                        this.data[dataIndex].first_name = this.table[entry.user - 1].first_name;
                        this.data[dataIndex].last_name = this.table[entry.user - 1].last_name;
                    } else {
                        console.log(requestValues)
                        for (const request of requestValues) {
                            if (request === "role_id") this.data[dataIndex].role_id = entry.role;
                            else if (request === "user_id") this.data[dataIndex].user_id = entry.user;
                            else if (request === "role_name") this.getRoleName(entry, dataIndex);
                            else if (request === "first_name") this.data[dataIndex].first_name = this.table[entry.user - 1].first_name;
                            else if (request === "last_name") this.data[dataIndex].last_name = this.table[entry.user - 1].last_name;
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