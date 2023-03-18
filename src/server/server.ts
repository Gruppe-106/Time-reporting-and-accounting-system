import {Express} from "express";
import {MainRouter} from "./mainRouter";

export class Server {
    private app: Express;
    private router: MainRouter

    constructor(app: Express) {
        this.app = app;
        this.router = new MainRouter();
        app.use('/', this.router.routes());
    }

    public start(port: number): void {
        this.app.listen(port, () => console.log(`[HTTP] Server listening on port ${port}, http://localhost:${port}`));
    }

    public stop(): void {
        this.server.close();
        console.log("Node Server is closed");
    }
}
