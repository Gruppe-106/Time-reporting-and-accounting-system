import {Request, Response} from "express";
import {User} from "../endpointBase";

interface UserCreationData {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    manager: number,
    roles: number[]
}

export default class UserCreationEndpoint {
    private user:User;
    constructor(user:User) {
        this.user = user;
    }
    public postRoute(req:Request, res:Response) {
        console.log(req.body);
        res.status(200).json(JSON.stringify({received: req.body}));
    }
}