import {Express} from "express";
import {MainRouter} from "./mainRouter";
import * as http from "http";

export class Server {
    private app: Express;
    private router: MainRouter
    //Need SSL cert for https server
    //private server: https.Server;
    private static server: http.Server;

    constructor(app: Express) {
        this.app = app;
        this.router = new MainRouter();
        app.use('/', this.router.routes());

        Server.server = http.createServer(app);
    }

    public start(port: number): void {
        Server.server.listen(port, () => console.log(`[Server] Server listening on port ${port}, http://localhost:${port}`));
    }

    public stop(): void {
        Server.server.close();
        console.log("[Server] Websocket closed");
    }
}