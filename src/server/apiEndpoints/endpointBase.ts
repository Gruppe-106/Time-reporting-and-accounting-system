import {ParsedQs} from "qs";
import {Request, Response} from "express";
import {Server} from "../server";
import {Where} from "../database/mysqlHandler";

export interface User {
    authKey: string;
    id?: number;
    role?: Roles;
}

enum Roles {
    NORMAL,
    MANAGER,
    PROJECT_MANAGER,
    ADMIN
}

abstract class EndpointBase {
    protected readonly user: User;
    protected readonly mySQL = Server.mysql;
    abstract allowedColumns: string[];

    constructor(user: User) {
        this.user = user;
    }

    //Needs to actually be implemented
    private ensureAuth():boolean {
        return this.user.authKey === "test";
    }

    /**
     * Gets data from DB and convert to client format
     * @param requestValues String[]: the values to request from the DB also known as columns
     * @param primaryKey String: The primary key to look for
     * @param keyEqual String[]?: Specific primary keys to look for if undefined get all aka *
     * @param data String[]?: Additional data needed for sending query
     * @return Promise object[] : containing the information to send to client
     */
    abstract getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?:string[]):Promise<object[]>;

    public async processRequest(requestValues: string[], primaryKey:string, keyEqual?:string[], data?:string[]):Promise<{status:number, data: object[]}> {
        try {
            if (this.ensureAuth()) {
                return {status: 200, data: await this.getData(requestValues, primaryKey, keyEqual)};
            }
            return {status: 401, data: [{error: "Not authorized"}]};
        } catch (e) {
            console.error(e);
            return {status: 404, data: [{error: "Failed to get data"}]};
        }
    }

    protected createWhere(primaryKey: string, keyEqual: string[]): Where | undefined {
        if (keyEqual.indexOf("*") === -1) {
            return  {column: primaryKey, equals: keyEqual};
        }
    }

    protected createColumns(requestValues: string[]): string[] {
        if (requestValues.indexOf("*") === -1) {
            return  requestValues.filter((value) => {
                if (this.allowedColumns.indexOf(value) !== -1) return value;
            })
        }
    }

    protected urlParamsConversion(params:string | string[] | ParsedQs | ParsedQs[], allowAll:boolean = true, throwOnMissing:boolean = false, res?:Response):string[] {
        let paramsList:string[];
        if (typeof params === "string" ) {
            paramsList = params.split(",");
        } else if (allowAll) {
            paramsList = ["*"];
        } else if (throwOnMissing) {
            this.badRequest(res);
        }
        return paramsList;
    }

    protected badRequest(res: Response) {
        res.sendStatus(400);
        res.end();
    }

    public getRoute(req:Request, res:Response, primaryKey:string = "id", requestKeysName:string = "ids") {
        let requestKeys: string[] = this.urlParamsConversion(req.query[requestKeysName], false, true, res);
        if (requestKeys === undefined) { return this.badRequest(res); }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(data.status).json(data);
        })
    };
}

export default EndpointBase;