import {Server} from "./server/server";
import express from "express";
import MysqlHandler from "./server/database/mysqlHandler";
import readline from 'readline'
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
const mysql: MysqlHandler = new MysqlHandler(mySQLConnectionConfig);

/*
mysql.insert("users", ["email", "firstName", "lastName", "groupId"], ["sam@example.com", "Sam", "Smith", "1"], (error, results, fields) => {
    console.log(error);
    console.log(results);
    console.log(fields);
    mysql.select("users", undefined, {column: "id", equals: ["1"]}, (error, results, fields) => {
        console.log(error);
        console.log(results);
        console.log(fields);
    })
})
*/

//Console input
const inquirer = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

inquirer.question("", input => {
    if (input === "stop") {
        server.stop();
        mysql.destroyConnection();
        inquirer.close();
        return;
    }
});

inquirer.on("close", function() {
    console.log("[Server] Server closed");
    process.exit(0);
});