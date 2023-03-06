// @ts-ignore
import express, {Request, Response} from "express";

export class Router {
    private router;
    constructor() {
        this.router = express.Router();
    }

    public routes() {
        this.router.get("/", (req: Request, res: Response): void => {
            res.send("Timesheet");
        })

        return this.router;
    }
}