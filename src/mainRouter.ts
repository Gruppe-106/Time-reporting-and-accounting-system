// @ts-ignore
import express, {Request, Response} from "express";
import { Router } from "express-serve-static-core";
import { ApiRouter } from "./server/routes/apiRouter";
import { BaseRouter } from "./server/baseRouter";
import path from "node:path";

export class MainRouter extends BaseRouter {
    public routes():Router {
        this.router.use("/api", new ApiRouter().routes());
        this.router.use(express.static(path.join(__dirname, "client")));
        this.router.get("/*", (req: Request, res: Response): void => {
            res.status(200).sendFile(path.join(__dirname, "/client/index.html"));
        });

        return this.router;
    }
}