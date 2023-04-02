import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse} from "../../database/mysqlHandler";
import {AuthKey, authKeyCreate} from "../../utility/authKeyCreator";

interface LoginData {
    email       : string,
    password    : string
}

class LoginEndpoint extends PostEndpointBase{
    requiredRole: number;
    
    async processRequest(req: Request, res: Response): Promise<{ status: number; data: object }> {
        return {status: 200, data: await this.submitData(req, res)};
    }

    async submitData(req: Request, res: Response): Promise<string[]> {
        let data: LoginData = req.body;

        let authResponse: MySQLResponse = await this.mySQL.select("AUTH", ["authKey", "authKeyEndDate", "password", "userId"], {column: "email", equals: [data.email]});
        if (authResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        if (data.password === authResponse.results[0].password) {
            let authKey:AuthKey = authKeyCreate(authResponse.results[0].userId);

            let authUpdateResponse: MySQLResponse = await this.mySQL.update("AUTH", [
                {column: "authKey", value: authKey.key}, {column: "authKeyEndDate", value: this.mySQL.dateFormatter(authKey.valid)}],
                {column: "userId", equals: [authResponse.results[0].userId.toString()]});
            if (authUpdateResponse.error !== null) return Promise.resolve(["Couldn't get authkey"]);

            return Promise.resolve(["success", authKey.key, authKey.valid.toString()]);
        }

        return Promise.resolve(["Password or email incorrect"]);
    }
}

export default LoginEndpoint;