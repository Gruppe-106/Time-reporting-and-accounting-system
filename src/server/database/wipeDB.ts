import {MySQLResponse} from "./mysqlHandler";
import {Server} from "../server";

export async function wipeDatabase() : Promise<boolean> {
    let response: MySQLResponse = await Server.mysql.SQLFileQuery("wipeInstructions.SQL");
    if (response.error === null) {
        console.log("[MySQL] Successfully wiped database");
        return true;
    }
    console.error("[MySQL] Failed to wipe database: ", response.error);
    return false;
}

export async function insertGeneric() : Promise<boolean> {
    let response: MySQLResponse = await Server.mysql.SQLFileQuery("genericData.SQL");
    if (response.error === null) {
        console.log("[MySQL] Successfully inserted generic data into database");
        return true;
    }
    console.error("[MySQL] Failed to insert generic data into database: ", response.error);
    return false;
}