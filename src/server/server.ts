import {Express} from "express";
import {MainRouter} from "./mainRouter";
import * as http from "http";
import readline from "readline";
import MysqlHandler from "./database/mysqlHandler";
import {MySQLConfig} from "../app";

export class Server {
    private app: Express;
    private router: MainRouter
    //Need SSL cert for https server
    //private server: https.Server;
    public static server: http.Server;
    public static mysql: MysqlHandler;

    constructor(app: Express, mySQLConnectionConfig: MySQLConfig, port: number, mysqlOnConnectCallback?: () => void) {
        this.app = app;
        this.router = new MainRouter();
        app.use('/', this.router.routes());

        Server.server = http.createServer(app);
        Server.mysql = new MysqlHandler(mySQLConnectionConfig, mysqlOnConnectCallback);
        this.start(port);

        this.commandLineInterface(this);
    }

    /**
     * Start websocket on the specified port
     * @param port Number: port to listen to
     */
    public start(port: number): void {
        Server.server.listen(port, () => console.log(`[Server] Server listening on port ${port}, http://localhost:${port}`));
    }

    /**
     * Stop the websocket
     */
    public stop(): void {
        Server.server.close();
        console.log("[Server] Websocket closed");
    }

    /**
     * Start the command line interface
     * @param server Server: server to interact with
     * @private
     */
    private commandLineInterface(server: Server) {
        const inquirer = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        inquirer.on("line", input => {
            if (input === "stop" || input.match(/^q(uit)?$/i)) {
                inquirer.question('[Server] Are you sure you want to exit? (y/n)> ', (answer) => {
                    if (answer.match(/^y(es)?$/i)) inquirer.close();
                });
            }
        });

        inquirer.on("close", function() {
            server.stop();
            Server.mysql.destroyConnection();
            console.log("[Process] Everything shutdown, ending process");
            process.exit(0);
        });
    }
}