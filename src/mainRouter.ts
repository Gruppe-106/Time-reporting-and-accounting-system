// @ts-ignore
import express, {Request, Response} from "express";
import { Router } from "express-serve-static-core";
import { ApiRouter } from "./server/routes/apiRouter";
import { BaseRouter } from "./server/baseRouter";

export class MainRouter extends BaseRouter {
    public routes():Router {
        this.router.use("/api", new ApiRouter().routes());
        return this.router;
    }
}