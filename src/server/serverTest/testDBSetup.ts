import {wipeDatabase} from "../database/wipeDB";
import {MySQLResponse} from "../database/mysqlHandler";
import {mysqlHandler} from "../../app";
import path from "node:path";

export async function createTestDBSetup(database: string = "testdb"): Promise<boolean> {
    if (await wipeDatabase(database)) {
        let response: MySQLResponse = await mysqlHandler.SQLFileQuery(path.join(__dirname, "testData.SQL"), database);
        if (response.error === null) {
            console.log("[MySQL] Successfully inserted test data");
            return true;
        }
        console.error("[MySQL] Failed to insert test data: ", response.error);
        return false;
    }
    return false;
}