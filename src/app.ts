//@ts-ignore
import express, {Request, Response} from "express";

import MysqlHandler, {MySQLConfig} from "./server/database/mysqlHandler";
import {Express} from "express";
import {fsReadJSON} from "./server/utility/jsonReader";
import {Server} from "./server/server";
import {insertGeneric} from "./server/database/wipeDB";
import {createTestDBSetup} from "./server/serverTest/testDBSetup";
import {clientServer} from "./clientServer";

import "./server/utility/array";

// --- Config ---
const apiPort: number = 8080;
const clientPort: number = 443;
const mySQLConnectionConfig: MySQLConfig = fsReadJSON("mysqlConnectionConfig.json");

let testMode: boolean = process.argv.contains("test");

// --- Server initialisation ---
const app: Express = express();
const server: Server = new Server(app);

// First create the mysql connection before listening on the server to insure database is reachable
const mysqlHandler: MysqlHandler = new MysqlHandler(mySQLConnectionConfig, testMode);
mysqlHandler.initConnection(async () => {
    // Check if a connection was made, if not kill the server
    if (!mysqlHandler.hasConnection()) {
        console.log("[MySQL] Couldn't establish a connection, shutting down");
        server.kill();
    }

    // See if any argument where given
    if (testMode) {
        // Create test database
        console.log("[MySQL] Creating test database");
        if (!(await createTestDBSetup("testdb"))) {
            console.log("[MySQL] Test database couldn't be created, shutting down");
            server.kill();
        }
    } else {
        // Add fake data to database if arg is given
        if (process.argv.contains("fake")) await insertGeneric();
        // Start listening on the server
        clientServer.listen(clientPort, () => { console.log("[Server] Client server is now running")});
    }
    server.start(apiPort);
})



export {mysqlHandler, server, mySQLConnectionConfig};