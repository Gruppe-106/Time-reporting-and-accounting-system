import {ParsedQs} from "qs";
import {Request, Response} from "express";

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
    private getRole:Roles[]
    private postRole:Roles[]

    abstract table:object[];
    abstract data:object[];

    constructor(user: User) {
        this.user = user;
    }

    //Needs to actually be implemented
    private ensureAuth():boolean {
        return this.user.authKey === "test";
    }

    public async processRequest(requestValues: string[], primaryKey:string, keyEqual?:string[], data?:string[]):Promise<object[]> {
        try {
            if (this.ensureAuth()) {
                return await this.getData(requestValues, primaryKey, keyEqual);
            }
        } catch (e) {
            console.error(e);
            return [{error: "Failed to get data"}];
        }
    }

    public async getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?:string[]):Promise<object[]> {
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.table) {
            if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1 || keyEqual.indexOf("*") !== -1) {
                this.data[dataIndex] = {}
                if (requestValues.indexOf("*") !== -1) {
                    this.data[dataIndex] = entry;
                } else {
                    for (const request of requestValues) {
                        if (entry[request]) this.data[dataIndex][request] = entry[request];
                    }
                }
                dataIndex++;
            }
        }
        return this.data;
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
        res.sendStatus(400)
        res.end();
    }

    public getRoute(req:Request, res:Response, primaryKey:string = "id", requestKeysName:string = "ids") {
        let requestKeys: string[] = this.urlParamsConversion(req.query[requestKeysName], false, true, res);
        if (requestKeys === undefined) { return; }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(requestedValues, primaryKey, requestKeys).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({status: 200, data: data});
        })
    };
}

export default EndpointBase;
