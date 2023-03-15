// @ts-ignore
import express, {Request, Response} from "express";
import {Router} from "express-serve-static-core";

export abstract class BaseRouter {
    protected router: Router;

    constructor() {
        this.router = express.Router();
    }

    abstract routes():Router;
}