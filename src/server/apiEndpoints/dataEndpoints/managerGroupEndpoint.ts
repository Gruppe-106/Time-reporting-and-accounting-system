import {User} from "../endpointBase";
import {USERS} from "../../database/fakeData/USERS";
import {Request, Response} from "express";
import EndpointConnectorBase from "../endpointConnectorBase";
import {GROUP} from "../../database/fakeData/GROUP";
import {UserEndpoint, UserReturnType} from "./userEndpoint";

interface ReturnType {
    manager_id?: number,
    manager_name?: string,
    group_id?: number,
    user_ids?: number[],
    user_names?: string[]
}

export class ManagerGroupEndpoint extends EndpointConnectorBase {
    table = new USERS().data;
    tableSecond = null;
    tableConnector = new GROUP().data;
    data: ReturnType[];

    async getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]): Promise<object> {
        let userEndpoint = new UserEndpoint(user);
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.tableConnector) {
            if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1 || keyEqual.indexOf("*") !== -1) {
                this.data[dataIndex] = {};
                if (requestValues.indexOf("*") !== -1) {
                    this.data[dataIndex].user_ids   = [];
                    this.data[dataIndex].user_names = [];
                    await userEndpoint.processRequest(["id", "first_name", "last_name", "group"], "id", ["*"]).then((value:UserReturnType) => {
                        if (value.id === entry.manager) this.data[dataIndex].manager_name = value.first_name + " " + value.last_name;
                        else if(value.group === entry.id) {
                            this.data[dataIndex].user_ids.push(value.id);
                            this.data[dataIndex].user_names.push(value.first_name + " " + value.last_name);
                        }
                    });
                    this.data[dataIndex].manager_id = entry.manager;
                    this.data[dataIndex].group_id = entry.id;
                } else {
                    console.log(requestValues)
                    for (const request of requestValues) {
                        //if      (request === "role_id")   this.data[dataIndex].role_id = entry["role"];
                        //else if (request === "user_id")   this.data[dataIndex].user_id = entry["user"];
                        //else if (request === "role_name") this.getRoleName(entry, dataIndex);
                    }
                }
                dataIndex++;
            }
        }
        return this.data;
    }
}

export function managerGroupRoute(req:Request, res:Response, user:User) {
    let managerIds = req.query.manager_ids;
    let groupIds = req.query.group_ids;
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