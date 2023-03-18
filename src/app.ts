import {Server} from "./server/server";
import express from "express";
import MysqlHandler from "./server/database/mysqlHandler";
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

mysql.select("users", ["id", "firstName"], {column: "id", equals: ["1"]}, (error, results, fields) => {
    console.log(error);
    console.log(results);
    console.log(fields);
    mysql.destroyConnection();
})

