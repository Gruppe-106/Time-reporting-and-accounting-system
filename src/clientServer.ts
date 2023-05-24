import express, {Express, Response} from "express";
import * as https from "https";
import path from "node:path";
import * as fs from "fs";

// Load in the SSL credentials for HTTPS
const privateKey : string = fs.readFileSync(path.join(__dirname, "server/SSL/client/selfsigned.key"), 'utf8');
const certificate: string = fs.readFileSync(path.join(__dirname, "server/SSL/client/selfsigned.crt"), 'utf8');

const credentials: {key: string, cert: string} = {key: privateKey, cert: certificate};

// Create express app
let app: Express = express();

// Serve static files from the client folder
app.use(express.static(path.join(__dirname, 'client')));

// Serve index.html for all routes
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/index.html')));

// Create HTTPS server with provided credentials
let server = https.createServer(credentials, app);

export {server as clientServer};