import {Server} from "./server/server";
import express from "express";
import MysqlHandler from "./server/database/mysqlHandler";
import readline from 'readline'
import AddFakeDataToDB from "./server/database/fakeData/addFakeDataToDB";
const app = express();

// --- Config ---
const port = 8080;
const mySQLConnectionConfig = {
    host     : "localhost",
    user     : "root",
    password : "CS-23-DAT-01",
    database : "timemanagerdatabase"
}

// Startup Node Server
const server = new Server(app);
server.start(port);

//Create Mysql connection
export const mysql: MysqlHandler = new MysqlHandler(mySQLConnectionConfig);

//Console input
const inquirer = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

inquirer.question("", input => {
    if (input === "stop") {
        inquirer.close();
    }
});

inquirer.on("close", function() {
    server.stop();
    mysql.destroyConnection();
    console.log("[Process] Everything shutdown, ending process");
    process.exit(0);
});