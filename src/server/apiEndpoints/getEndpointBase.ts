import {ParsedQs} from "qs";
import {Request, Response} from "express";
import EndpointBase from "./endpointBase";

abstract class GetEndpointBase extends EndpointBase{
    abstract allowedColumns: string[];

    /**
     * Gets data from DB and convert to client format
     * @param requestValues String[]: the values to request from the DB also known as columns
     * @param primaryKey String: The primary key to look for
     * @param keyEqual String[]?: Specific primary keys to look for if undefined get all aka *
     * @param data String[]?: Additional data needed for sending query
     * @return Promise object[] : containing the information to send to client
     */
    abstract getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?:string[]): Promise<object[]>;

    public async processRequest(req: Request, requestValues: string[], primaryKey:string, keyEqual?:string[], data?:string[]):Promise<{status:number, data: object[]}> {
        try {
            if (await this.ensureAuth(req)) {
                return {status: 200, data: await this.getData(requestValues, primaryKey, keyEqual, data)};
            }
            console.log(req.headers.cookie, {status: 401, data: [{error: "Not authorized"}]});
            return {status: 401, data: [{error: "Not authorized"}]};
        } catch (e) {
            console.error(e);
            return {status: 404, data: [{error: "Failed to get data"}]};
        }
    }

    protected createColumns(requestValues: string[]): string[] {
        if (requestValues.indexOf("*") === -1) {
            return  requestValues.filter((value) => {
                if (this.allowedColumns.indexOf(value) !== -1) return value;
            })
        }
    }

    protected urlParamsConversion(params:string | string[] | ParsedQs | ParsedQs[], allowAll:boolean = true, throwOnMissing:boolean = false, res?:Response, req?: Request): string[] {
        let paramsList:string[];
        if (typeof params === "string" ) {
            paramsList = params.split(",");
        } else if (allowAll) {
            paramsList = ["*"];
        } else if (throwOnMissing) {
            this.badRequest(res, req);
        }
        return paramsList;
    }

    public getRoute(req:Request, res:Response, primaryKey:string = "id", requestKeysName:string = "ids"): void {
        let requestKeys: string[] = this.urlParamsConversion(req.query[requestKeysName], false, true, res, req);
        if (requestKeys === undefined) { return this.badRequest(res, req); }

        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(req, requestedValues, primaryKey, requestKeys).then((data) => {
            if (!res.writableEnded) {
                res.setHeader('Content-Type', 'application/json');
                res.status(data.status).json(data);
                res.end();
            }
        })
    };
}

export default GetEndpointBase;