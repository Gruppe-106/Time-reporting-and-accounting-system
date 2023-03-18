import * as mysql from "mysql";
import {Connection, FieldInfo, MysqlError, Query} from "mysql";

interface Where {
    column: string,
    equals: string[]
}

class MysqlHandler {
    private static connectionConfig: object = undefined;
    private static connection: Connection   = undefined;

    constructor(connectionConfig?:object) {
        if (connectionConfig !== undefined) { MysqlHandler.connectionConfig = connectionConfig; }
        this.hasOrCreateConnection();
    }

    public hasConnection(): boolean {
        return MysqlHandler.connection !== undefined;
    }

    private createConnection(): boolean {
        if (MysqlHandler.connectionConfig !== undefined) {
            MysqlHandler.connection = mysql.createConnection(MysqlHandler.connectionConfig);

            MysqlHandler.connection.connect((e: MysqlError) => {
                if (e) {
                    console.log("[MySQL] failed to connect to database. Error: ", e.stack);
                    return false;
                }
                console.log(`[MySQL] Connected to database with id: ${MysqlHandler.connection.threadId}`);
                return true;
            });
        }
        return false;
    }

    public hasOrCreateConnection(): boolean {
        if (!this.hasConnection()) {
            return this.createConnection();
        }
        return true;
    }

    public destroyConnection(): void {
        MysqlHandler.connection.destroy();
        console.log("[MySQL] connection to database destroyed");
    }

    private createWhereString(where?:Where): string {
        return where !== undefined ? "WHERE " + where.column + " in (" + where.equals.toString() + ")" : "";
    }

    private sendQuery(sqlQuery: string, callback?: (error: MysqlError | null, results: any, fields: FieldInfo[]) => void): void {
        if (this.hasOrCreateConnection()) {
            MysqlHandler.connection.query({ sql: sqlQuery, timeout: 30000 }, callback);
        }
    }

    public select(table: string, columns?: string[], where?:Where, callback?: (error: MysqlError | null, results: any, fields: FieldInfo[]) => void): void {
        let queryString = `SELECT ${columns !== undefined ? columns : "*"} FROM ${table} ${this.createWhereString(where)}`;
        this.sendQuery(queryString, callback);
    }
}

export default MysqlHandler;