import express, {Express, Request, Response} from "express";
import * as https from "https";
import path from "node:path";
import {credentials} from "./server/server";

let app: Express = express();

app.use(express.static(path.join(__dirname, "client")));
app.get("/*", (req: Request, res: Response): void => {
    res.status(200).sendFile(path.join(__dirname, "/client/index.html"));
});

let server = https.createServer(credentials, app);

export {server as clientServer};