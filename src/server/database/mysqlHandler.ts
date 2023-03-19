import * as mysql from "mysql";
import {Connection, FieldInfo, MysqlError} from "mysql";

export interface Where {
    column: string,
    equals: string[]
}

export interface MySQLResponse {
    error: MysqlError | null,
    results: any,
    fields: FieldInfo[]
}

class MysqlHandler {
    private static connectionConfig: object = undefined;
    private static connection: Connection   = undefined;

    constructor(connectionConfig?:object) {
        if (connectionConfig !== undefined) { MysqlHandler.connectionConfig = connectionConfig; }
        this.hasOrCreateConnection();
    }

    /**
     * @return Boolean: Returns whether a MySQL connection is present or not
     */
    public hasConnection(): boolean {
        return MysqlHandler.connection !== undefined;
    }

    /** Tries to create a connection to a MySQL database if one doesn't exist
     * @return Boolean: Returns whether a MySQL connection is present or not
     * @private
     */
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

    /** Checks if connection is present, if not try to create one
     * @return Boolean: Returns true if connection is present otherwise false
     */
    public hasOrCreateConnection(): boolean {
        if (!this.hasConnection()) {
            return this.createConnection();
        }
        return true;
    }

    /**
     * Stops connection to the mysql server
     */
    public destroyConnection(): void {
        if (this.hasConnection()) {
            MysqlHandler.connection.destroy();
            return console.log("[MySQL] Connection to database destroyed");
        }
        console.log("[MySQL] No connection to destroy")
    }

    /**
     * Creates a string with the sql query condition
     * @param where Where: condition includes column to check and what to check against
     * @return String: of the condition or an empty string if where is empty
     * @private
     */
    private createWhereString(where?:Where): string {
        return where !== undefined ? "WHERE " + where.column + " in (" + where.equals.toString() + ")" : "";
    }

    /**
     * Creates a string of all insert values
     * @param values string[][] | string[]: a list of all values to insert
     * @return String: string of all insert values
     * @private
     */
    private createValuesString(values: string[][] | string[]): string {
        let valuesString: string;
        if (Array.isArray(values[0])) {
            let valueList: string[] = [];
            for (const value of values) {
                valueList.push(`(${value})`);
            }
            valuesString = `${valueList}`;
        } else {
            valuesString = `(${values})`;
        }

        /* Each value in the list has to have '' around them e.g. 1 has to be '1'
           This ensures all variable in the string has the quotes (There is definitely a better solution to this)*/
        return valuesString.replace(/\((?!['])/g, "('")
                           .replace(/(?<!['])\)/g, "')")
                           .replace(/(?<![\)']),'|(?<![\)']),(?![\('])|',(?![\('])/g, "','");
    }

    /**
     * Sends a query to the database if one is present
     * @param sqlQuery String: query to send to server
     * @param callback Callback: callback function to process data
     * @private
     */
    public async sendQuery(sqlQuery: string): Promise<MySQLResponse>{
        if (this.hasOrCreateConnection()) {
            let promise:Promise<MySQLResponse> = new Promise<MySQLResponse>((resolve) =>  {
                MysqlHandler.connection.query({ sql: sqlQuery, timeout: 30000 }, (error: MysqlError | null, results: any, fields: FieldInfo[]) => {
                    if (error !== null) {
                        console.log("[MySQL] Error retrieving data: ", error);
                    }
                    resolve({
                        error: error,
                        results: results,
                        fields: fields
                    });
                });
            })
            console.log("[MySQL] Retrieving data from DB, query: ", sqlQuery);
            return promise;
        }
        return {error: undefined, results: undefined, fields: undefined};
    }

    /**
     * Sends a select query to server
     * @param table String: table to get data from
     * @param columns String[]?: column(s) to retrieve
     * @param where Where?: condition for the selection of data
     */
    public select(table: string, columns?: string[], where?:Where): Promise<MySQLResponse> {
        let queryString = `SELECT ${columns !== undefined ? columns : "*"} FROM ${table} ${this.createWhereString(where)}`;
        return this.sendQuery(queryString);
    }

    /**
     * Sends an insert query to server
     * @param table String: table to get data from
     * @param columns String[]: column(s) to insert into
     * @param values string[][] | string[]: values to insert into columns
     */
    public insert(table: string, columns: string[], values: string[][] | string[]): Promise<MySQLResponse> {
        let queryString = `INSERT INTO ${table} (${columns}) VALUES ${this.createValuesString(values)}`;
        return this.sendQuery(queryString);
    }

    public dateFormatter(date:number): string {
        return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    }

    public dateToNumber(date:Date): number {
        return date.getTime();
    }
}

export default MysqlHandler;