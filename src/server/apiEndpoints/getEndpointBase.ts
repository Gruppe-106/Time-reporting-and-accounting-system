import {ParsedQs} from "qs";
import {Request, Response} from "express";
import EndpointBase from "./endpointBase";

export interface PrimaryKeyType {
    urlKey: string,
    mysqlKey: string,
    allowAll?: boolean,
    throwOnMissing?: boolean
}

abstract class GetEndpointBase extends EndpointBase{
    abstract allowedColumns: string[];
    abstract urlPrimaryKey: PrimaryKeyType[];

    /**
     * Gets data from DB and convert to client format
     * @param requestValues String[]: the values to request from the DB also known as columns
     * @param primaryKey String: The primary key to look for
     * @param keyEqual String[]?: Specific primary keys to look for if undefined get all aka *
     * @param data String[]?: Additional data needed for sending query
     * @return Promise object[] : containing the information to send to client
     */
    abstract getData(requestValues: string[], primaryKey: string, keyEqual?: string[], data?:string[]): Promise<object[]>;

    /**
     * @brief Processes the request and returns the data to the client
     * @param req The request object// We can add common methods that are used in multiple endpoints to the GetEndpointBase class
     * @param requestValues An array of strings representing the requested column values
     * @param primaryKey The primary key to look for
     * @param keyEqual Specific primary keys to look for if undefined get all aka *
     * @param data Additional data needed for sending query
     * @return A Promise containing an object with the status and data to send to the client
     */
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

    /**
     * @brief Creates an array of columns based on the input request values
     * @param requestValues An array of strings representing the requested column values
     * @return An array of strings representing the created columns. If "*" is not present in the requestValues array, only values that are present in the allowedColumns property are returned
     */
    protected createColumns(requestValues: string[]): string[] {
        if (requestValues.indexOf("*") === -1) {
            return requestValues.filter((value) => {
                if (this.allowedColumns.indexOf(value) !== -1) return value;
            })
        }
        return this.allowedColumns;
    }

    /**
     * @brief Converts URL parameters to an array of strings
     * @param params The URL parameters to convert
     * @param allowAll Whether or not to allow all parameters
     * @param throwOnMissing Whether or not to throw an error if parameters are missing
     * @param res The response object
     * @param req The request object
     * @return An array of strings representing the URL parameters
     */
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

    /**
     * Search for primary keys in the url based on urlPrimaryKey list in class
     * @param req The request object
     * @param res The response object
     * @return [key, values] or undefined: A tuple containing the mysql key and list of values gotten
     * @protected
     */
    protected findPrimaryKeys(res: Response, req: Request): [string, string[]] {
        for (const urlPrimaryKeyElement of this.urlPrimaryKey) {
            let param: string[] = this.urlParamsConversion(req.query[urlPrimaryKeyElement.urlKey], urlPrimaryKeyElement.allowAll, urlPrimaryKeyElement.throwOnMissing, res, req)
            if (param !== undefined) return [urlPrimaryKeyElement.mysqlKey, param]
        }
        return undefined;
    }

    /**
     * @brief Gets the route and returns the data to the client
     * @param req The request object
     * @param res The response object
     * @param primaryKey The primary key to look for
     * @param requestKeysName The name of the request keys
     */
    public getRoute(req:Request, res:Response): void {
        let [primaryKey, requestKeys] = this.findPrimaryKeys(res, req);
        if (primaryKey === undefined || requestKeys === undefined) return;
        //Get vars if any otherwise it will get all
        let requestedValues:string[] = this.urlParamsConversion(req.query.var);

        this.processRequest(req, requestedValues, primaryKey, requestKeys).then((data) => {
            if (!res.writableEnded) {
                if (data.data === undefined) return this.badRequest(res, req);
                res.setHeader('Content-Type', 'application/json');
                res.status(data.status).json(data);
                res.end();
            }
        })
    };
}

export default GetEndpointBase;
