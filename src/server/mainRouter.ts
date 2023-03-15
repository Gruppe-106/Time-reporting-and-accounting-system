// @ts-ignore
import express, {Request, Response} from "express";
import { Router } from "express-serve-static-core";
import { ApiRouter } from "./routes/apiRouter";
import { BaseRouter } from "./baseRouter";

export class MainRouter extends BaseRouter {
    public routes():Router {
        this.router.get("/", (req: Request, res: Response): void => {
            res.send("Timesheet");
        })

        this.router.use("/api", new ApiRouter().routes());

        return this.router;
    }
}