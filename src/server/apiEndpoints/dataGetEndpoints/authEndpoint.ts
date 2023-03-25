import {Request, Response} from "express";
import {getCookies} from "../../utility/cookie";
import {MySQLResponse} from "../../database/mysqlHandler";
import {Server} from "../../server";

interface AuthApi {
    authKey:        string,
    authKeyEndDate: string,
    userId:         number
}

class AuthEndpoint {
    public async getRoute(req:Request, res:Response): Promise<void> {
        res.setHeader('Content-Type', 'application/json');
        try {
            let cookies: Map<string, string> = getCookies(req.headers.cookie);
            if (cookies.has("auth")) {
                let authKey: string = cookies.get("auth");
                let authResponse: MySQLResponse = await Server.mysql.select("auth", ["authKey", "authKeyEndDate", "userId"], {column: "authKey", equals: [authKey]});
                if (authResponse.error !== null) throw new Error("[MySQL] Failed to retrieve data");

                let auth: AuthApi = authResponse.results[0];

                if (authKey === auth.authKey) {
                    if (Date.now() < Server.mysql.dateToNumber(new Date(auth.authKeyEndDate))) {
                        res.status(200).json({status: 200, data: {success: true, userId: auth.userId}});
                        return;
                    }
                }
            } else {
                throw new Error("[Auth] No auth cookie provided");
            }
            res.status(200).json({status: 200, data: {success: false}});
            return;
        } catch (e) {
            res.status(404).json({status: 404, data: {success: false}});
            return;
        }
    }
}

export default AuthEndpoint;