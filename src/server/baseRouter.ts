// @ts-ignore
import express, {Request, Response} from "express";
import {Router} from "express-serve-static-core";

export class BaseRouter {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes() {
        this.router.get("/", (req: Request, res: Response): void => {
            res.send("Timesheet");
        })

        this.router.route("/api").get((req: Request, res: Response): void => {

            res.setHeader('Content-Type'                , 'application/json');
            res.setHeader("Access-Control-Allow-Origin" , "*");
            res.setHeader("Access-Control-Allow-Methods", "GET");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Auth-Key");

            res.status(200).json(JSON.stringify({message: "Api get"}));
        }).post((req: Request, res: Response): void => {
            res.send("Api post");
        })

        return this.router;
    }
}