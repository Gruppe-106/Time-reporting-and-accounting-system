import {Express} from "express";
import {MainRouter} from "./mainRouter";
import * as https from "https";

export class Server {
    private app: Express;
    private router: MainRouter
    private server: https.Server;

    constructor(app: Express) {
        this.app = app;
        this.router = new MainRouter();
        app.use('/', this.router.routes());

        this.server = https.createServer(app);
    }

    public start(port: number): void {
        this.server.listen(port, () => console.log(`[HTTP] Server listening on port ${port}, http://localhost:${port}`));
    }

    public stop(): void {
        this.server.close();
        console.log("Node Server is now closed");
    }
}