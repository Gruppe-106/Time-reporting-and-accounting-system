import express, {Express, Request, Response} from "express";
import * as https from "https";
import path from "node:path";
import {credentials} from "./server/server";

// Create express app
let app: Express = express();

// Serve static files from the client folder
app.use(express.static(path.join(__dirname, "client")));

// Serve index.html for all routes
app.get("/*", (res: Response): void => {
    res.status(200).sendFile(path.join(__dirname, "/client/index.html"));
});

// Create HTTPS server with provided credentials
let server = https.createServer(credentials, app);

export {server as clientServer};