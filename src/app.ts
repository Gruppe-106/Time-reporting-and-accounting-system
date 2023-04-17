import {Server} from "./server/server";
import express, {Express} from "express";
import {fsReadJSON} from "./server/utility/jsonReader";
import {insertGeneric, wipeDatabase} from "./server/database/wipeDB";

export interface MySQLConfig {
    host    : string,
    user    : string,
    password: string,
    database: string
}

// --- Config ---
const app: Express = express();
const port: number = 8080;
const mySQLConnectionConfig: MySQLConfig = fsReadJSON("mysqlConnectionConfig.json");

// Startup Server
export const server: Server = new Server(app, mySQLConnectionConfig, port, async () => {
    let arg: string[] = process.argv;
    // Wipe database if arg is given
    if (arg.indexOf("wipe") !== -1) await wipeDatabase();
    // Add fake data to database if arg is given
    if (arg.indexOf("fake") !== -1) await insertGeneric();
    // Select the default database
    Server.mysql.selectDatabase();
});