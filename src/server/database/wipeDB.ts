import MysqlHandler, {MySQLResponse} from "./mysqlHandler";
import {mysqlHandler} from "../../app";
import path from "node:path";

export async function wipeDatabase(database: string = MysqlHandler.database) : Promise<boolean> {
    let response: MySQLResponse = await mysqlHandler.SQLFileQuery(path.join(__dirname, "wipeInstructions.SQL"), database);
    if (response.error === null) {
        console.log("[MySQL] Successfully wiped database");
        return true;
    }
    console.error("[MySQL] Failed to wipe database: ", response.error);
    return false;
}

export async function insertGeneric(database: string = MysqlHandler.database) : Promise<boolean> {
    let response: MySQLResponse = await mysqlHandler.SQLFileQuery(path.join(__dirname, "genericData.SQL"), database);
    if (response.error === null) {
        console.log("[MySQL] Successfully inserted generic data into database");
        return true;
    }
    console.error("[MySQL] Failed to insert generic data into database: ", response.error);
    return false;
}