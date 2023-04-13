import {Server} from "./server/server";
import express from "express";
import AddFakeDataToDB, {mysqlCallback} from "./server/database/fakeData/addFakeDataToDB";
import * as fs from "fs";

export interface MySQLConfig {
    host    : string,
    user    : string,
    password: string,
    database: string
}

// --- Config ---
const app = express();
const port = 8080;
const mySQLConnectionConfig: MySQLConfig = JSON.parse(fs.readFileSync("mysqlConnectionConfig.json", {encoding: "utf-8"}));

// Startup Server
export const server: Server = new Server(app, mySQLConnectionConfig, port, mysqlCallback);