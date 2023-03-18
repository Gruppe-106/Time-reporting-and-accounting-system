import {Express} from "express";
import {MainRouter} from "./mainRouter";
import * as Http from "http";

export class Server {
    private app: Express;
    private router: MainRouter
    private server: Http.Server;

    constructor(app: Express) {
        this.app = app;
        this.router = new MainRouter();
        app.use('/', this.router.routes());
    }

    public start(port: number): void {
        this.server = this.app.listen(port, () => console.log(`[Server] Server listening on port ${port}, http://localhost:${port}`));
    }

    public stop(): void {
        this.server.close();
        console.log("[Server] Node Server is closed");
    }
}
