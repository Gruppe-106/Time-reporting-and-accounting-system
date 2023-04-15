import {MySQLResponse} from "./mysqlHandler";
import {Server} from "../server";

const fs = require("fs");
const path = require("path");

export async function wipeDatabase() : Promise<boolean> {
    if (Server.mysql.hasOrCreateConnection())  {
        let query: string = fs.readFileSync(path.join(__dirname, "wipeInstructions.SQL"), {encoding: "utf-8"})
            .replace(/\$\{db\}/g, Server.mysql.database); // Replace db with actual db/schema name
        return await Server.mysql.sendQuery(query).then((response: MySQLResponse) => {
            if (response.error === null) {
                console.log("[MySQL] Successfully wiped database");
                return true;
            }
            console.error("[MySQL] Failed to wipe database: ", response.error);
            return false;
        });
    }
}

export async function insertGeneric() : Promise<boolean> {
    if (Server.mysql.hasOrCreateConnection())  {
        let query: string = fs.readFileSync(path.join(__dirname, "genericData.SQL"), {encoding: "utf-8"})
            .replace(/\$\{db\}/g, Server.mysql.database); // Replace db with actual db/schema name
        return await Server.mysql.sendQuery(query).then((response: MySQLResponse) => {
            if (response.error === null) {
                console.log("[MySQL] Successfully inserted generic data into database");
                return true;
            }
            console.error("[MySQL] Failed to insert generic data into database: ", response.error);
            return false;
        });
    }
}