import {Server} from "./server/server";
import express, {Express} from "express";
import {mysqlCallback} from "./server/database/fakeData/addFakeDataToDB";
import {fsReadJSON} from "./server/utility/jsonReader";

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
export const server: Server = new Server(app, mySQLConnectionConfig, port, mysqlCallback);