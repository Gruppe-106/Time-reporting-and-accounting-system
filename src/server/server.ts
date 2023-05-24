import {Express} from "express";
import {MainRouter} from "../mainRouter";
import * as readline from "readline";
import {mysqlHandler} from "../app";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import {clientServer} from "../clientServer";

// Load in the SSL credentials for HTTPS
const privateKey : string = fs.readFileSync(path.join(__dirname, "/SSL/server/selfsigned.key"), 'utf8');
const certificate: string = fs.readFileSync(path.join(__dirname, "/SSL/server/selfsigned.crt"), 'utf8');

const credentials: {key: string, cert: string} = {key: privateKey, cert: certificate};

export class Server {
    private app: Express;
    private router: MainRouter
    public static server: https.Server | http.Server;

    constructor(app: Express) {
        this.app = app;
        this.router = new MainRouter();
        app.use('/', this.router.routes());

        // If server is in test mode, start the server on http instead of https
        if (process.argv.indexOf("test") !== -1)
            Server.server = http.createServer(app);
        else
            Server.server = https.createServer(credentials, app);

        this.commandLineInterface();
    }

    /**
     * Start websocket on the specified port
     * @param port Number: port to listen to
     */
    public start(port: number): void {
        Server.server.listen(port, () => console.log(`[Server] Server listening on port ${port}, https://localhost:${port}`));
    }

    /**
     * Stop the websocket
     */
    public stop(): void {
        Server.server.close();
        console.log("[Server] Websocket closed");
    }

    /**
     * Kills the server and the main mysql connection
     */
    public kill(): void {
        clientServer.close();
        this.stop();
        mysqlHandler.destroyConnection();
        console.log("[Process] Everything shutdown, ending process");
        process.exit(0);
    }

    /**
     * Start the command line interface
     * @param server Server: server to interact with
     * @private
     */
    private commandLineInterface(server: Server = this): void {
        const inquirer = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Only for use in ide to stop the server
        inquirer.on("line", (input) => {
            if (input === "stop" || input.match(/^q(uit)?$/i)) {
                inquirer.question('[Server] Are you sure you want to exit? (y/n)> ', (answer) => {
                    if (answer.match(/^y(es)?$/i)) inquirer.close();
                });
            }
        });

        // On the linux server PM2 automatically calls this function when told to stop the server
        inquirer.on("close", function() {
            server.kill();
        });
    }
}