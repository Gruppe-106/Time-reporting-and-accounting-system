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

// Allows to add specific fake data to server
// This is only for dev and testing purposes
let arg: string[] = process.argv;
const mysqlCallback = () => {
    let addFakeDB = new AddFakeDataToDB();
    if (arg.length !== 0) {
        if (arg.indexOf("addfake") !== -1) {
            addFakeDB.addAll();
        } else {
            if (arg.indexOf("addusers")       !== -1) { addFakeDB.addUSERS(); }
            if (arg.indexOf("addauths")       !== -1) { addFakeDB.addAUTHS(); }
            if (arg.indexOf("addgroup")       !== -1) { addFakeDB.addGROUP(); }
            if (arg.indexOf("addproject")     !== -1) { addFakeDB.addPROJECT(); }
            if (arg.indexOf("addroles")       !== -1) { addFakeDB.addROLES(); }
            if (arg.indexOf("addtimetypes")   !== -1) { addFakeDB.addTIMETYPES(); }
            if (arg.indexOf("addtasks")       !== -1) { addFakeDB.addTASKS(); }
            if (arg.indexOf("addtaskproject") !== -1) { addFakeDB.addTASKPROJECT(); }
            if (arg.indexOf("adduserrole")    !== -1) { addFakeDB.addUSERROLE(); }
            if (arg.indexOf("addusertasktimeregister") !== -1) { addFakeDB.addUSERTASKTIMEREGISTER(); }
            if (arg.indexOf("adduserstasks")           !== -1) { addFakeDB.addUSERSTASKS(); }
            if (arg.indexOf("addprojectsmanager")      !== -1) { addFakeDB.addPROJECTSMANAGER(); }
        }
    }
}

// Startup Server
export const server: Server = new Server(app, mySQLConnectionConfig, port, mysqlCallback);