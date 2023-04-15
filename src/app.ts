import {Server} from "./server/server";
import express, {Express} from "express";
import {addFakeMysqlCallback} from "./server/database/fakeData/addFakeDataToDB";
import {fsReadJSON} from "./server/utility/jsonReader";
import {wipe} from "./server/database/wipeDB";

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
    if (arg.indexOf("wipe") !== -1) await wipe();
    // Select the default database
    Server.mysql.selectDatabase();
    // Add fake data if arg is given
    addFakeMysqlCallback(arg);
});