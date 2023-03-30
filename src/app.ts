import {Server} from "./server/server";
import express from "express";
import AddFakeDataToDB from "./server/database/fakeData/addFakeDataToDB";

// --- Config ---
const app = express();
const port = 8080;
const mySQLConnectionConfig = {
    host     : "localhost",
    user     : "nodejs",
    password : "qoqnlF899SkkFTR4",
    database : "timemanagerdatabase"
}

let arg:string[] = process.argv;

// Startup Server
export const server: Server = new Server(app, mySQLConnectionConfig, port);

while (!Server.mysql.hasConnection());
if (arg.indexOf("addfake") !== -1) {
    new AddFakeDataToDB().addAll();
}