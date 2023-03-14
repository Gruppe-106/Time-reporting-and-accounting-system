import {Express} from "express";
import {BaseRouter} from "./baseRouter";

export class Server {
    private app: Express;
    private router: BaseRouter

    constructor(app: Express) {
        this.app = app;
        this.router = new BaseRouter();

        app.use('/', this.router.routes());
    }

    public start(port: number): void {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!, http://localhost:${port}`));
    }
}