//@ts-ignore
import express from "express";

import MysqlHandler, {MySQLConfig} from "./server/database/mysqlHandler";
import {Express} from "express";
import {fsReadJSON} from "./server/utility/jsonReader";
import {Server} from "./server/server";
import {insertGeneric} from "./server/database/wipeDB";
import {createTestDBSetup} from "./server/serverTest/testDBSetup";

// --- Config ---
const port: number = 8080;

const app: Express = express();
const mySQLConnectionConfig: MySQLConfig = fsReadJSON("mysqlConnectionConfig.json");

const server: Server = new Server(app);

// First create the mysql connection before listening on the server to insure database is reachable
const mysqlHandler: MysqlHandler = new MysqlHandler(mySQLConnectionConfig, async () => {
    // Check if a connection was made, if not kill the server
    if (!mysqlHandler.hasConnection()) {
        console.log("[MySQL] Couldn't establish a connection, shutting down");
        server.kill();
    }

    // See if any argument where given
    if (process.argv.indexOf("test") !== -1) {
        // Create test database
        console.log("[MySQL] Creating test database");
        if (!(await createTestDBSetup("testdb"))) {
            console.log("[MySQL] Test database couldn't be created, shutting down");
            server.kill();
        }
        // Select the default database
        mysqlHandler.selectDatabase("testdb");
    } else {
        // Add fake data to database if arg is given
        if (process.argv.indexOf("fake") !== -1) await insertGeneric();

        // Select the default database
        mysqlHandler.selectDatabase();
    }

    // Start listening on the server
    server.start(port);
});

export {mysqlHandler, server, mySQLConnectionConfig};