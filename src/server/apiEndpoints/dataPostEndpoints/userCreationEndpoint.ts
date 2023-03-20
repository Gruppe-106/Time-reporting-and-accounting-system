import {Request, Response} from "express";

interface UserCreationData {
    firstName   : string,
    lastName    : string,
    email       : string,
    password    : string,
    manager     : number,
    roles       : number[]
}

const requiredIndexes = [
    "firstName",
    "lastName",
    "email",
    "password",
    "manager",
    "roles"
]

export default class UserCreationEndpoint {
    /**
     * Ensures all necessary data is present and removes unwanted
     * @param body Any: the body of the POST request
     * @return String[]: list of missing entries or UserCreationData: sanitized data
     * @private
     */
    private dataConverter(body: any): UserCreationData | string[] {
        let data: UserCreationData = body;
        let sanitizedData: UserCreationData = {
            email: "",
            firstName: "",
            lastName: "",
            manager: 0,
            password: "",
            roles: []
        };
        let missing: string[] = [];
        //Go through all necessary entries add them if present otherwise add them to missing
        for (const index of requiredIndexes) {
            if (data[index] !== undefined) sanitizedData[index] = data[index];
            else missing.push(index);
        }
        if (missing.length !== 0) return missing;
        return sanitizedData;
    }

    /**
     * The POST called for "/api/user/creation/post".
     * This for the creation of users in the system
     * @param req Request: request from the HTTP request
     * @param res Response: response for the HTTP request
     */
    public postRoute(req:Request, res:Response):void {
        let data:UserCreationData | string[] = this.dataConverter(req.body)
        if (data.constructor === Array) {
            res.status(404).json({status: 404, success: false, missing: data });
            res.end();
            return;
        }
        res.status(200).json({status: 200, success: true});
        res.end();
    }
}