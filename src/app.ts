import {Server} from "./server/server";
import express from "express";

// --- Config ---
const app = express();
const port = 8080;
const mySQLConnectionConfig = {
    host     : "localhost",
    user     : "root",
    password : "CS-23-DAT-01",
    database : "timemanagerdatabase"
}

// Startup Server
export const server: Server = new Server(app, mySQLConnectionConfig, port);