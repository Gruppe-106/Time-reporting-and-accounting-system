import {Router} from "express-serve-static-core";
import {Request, Response} from "express";
import {BaseRouter} from "../baseRouter";

export class ApiRouter extends BaseRouter {
    private getRoutes() {
        this.router.get("/", (req: Request, res: Response): void => {

            res.setHeader('Content-Type'                , 'application/json');
            res.setHeader("Access-Control-Allow-Origin" , "*");
            res.setHeader("Access-Control-Allow-Methods", "GET");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Auth-Key");

            res.status(200).json(JSON.stringify({message: "Api get"}));
        })
    }

    private postRoutes() {
        this.router.post("/", (req: Request, res: Response): void => {
            res.send("Api post");
        })
    }

    public routes(): Router {
        this.getRoutes();
        this.postRoutes();
        return this.router;
    }
}