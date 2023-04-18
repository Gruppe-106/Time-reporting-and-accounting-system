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
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            return {status: 404, data: {success: "false", message: "Missing Body"}};
        }
        return {status: 200, data: await this.submitData(req, res)};
    }

    async submitData(req: Request, res: Response): Promise<string[]> {
        let data: LoginData = req.body;
        if (data.email === undefined || data.password === undefined) return ["Password and/or email invalid"];

        // Try to get the auth table with the specified email
        let authResponse: MySQLResponse = await this.mySQL.select("AUTH", ["authKey", "authKeyEndDate", "password", "userId"], {column: "email", equals: [data.email]});
        if (authResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");

        // Check if the password match
        if (data.password === authResponse.results[0].password) {
            // If auth key is still valid return it, this is so login on other devices doesn't lose their auth token
            // Should properly be unique based on hardware id
            if (new Date(authResponse.results[0].authKeyEndDate).getTime() > Date.now()) {
                return Promise.resolve(["success", authResponse.results[0].authKey, new Date(authResponse.results[0].authKeyEndDate).getTime()]);
            }

            // Otherwise create a new one and add it to the database
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