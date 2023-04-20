import * as mysql from "mysql2";
import {Connection, Field, QueryError} from "mysql2";
import {wipeDatabase} from "./wipeDB";
import * as fs from "fs";
import * as path from "path";
import {mysqlHandler} from "../../app";

export interface MySQLConfig {
    host     : string,
    user     : string,
    password : string,
    database : string
}

export interface Where {
    column : string,
    equals : string[]
}

export interface UpdateSet {
    column : string,
    value  : string
}

export interface MySQLResponse {
    error   : QueryError | null,
    results : any | null,
    fields  : Field[] | null
}

class MysqlHandler {
    private logQueries: boolean = false;
    private static connectionConfig: MySQLConfig;
    private static connection: Connection;
    public static readonly database: string = "timemanagerdatabase";

    constructor(connectionConfig: MySQLConfig, mysqlOnConnectCallback: () => void) {
        if (connectionConfig !== undefined) { MysqlHandler.connectionConfig = connectionConfig; }
        this.hasOrCreateConnection();
        this.databaseExists(MysqlHandler.database, process.argv.indexOf("wipe") !== -1).then(() => {
            mysqlOnConnectCallback();
        });
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

            MysqlHandler.connection.connect((e: QueryError | null) => {
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

    public selectDatabase(database: string = MysqlHandler.database): void {
        MysqlHandler.connection.changeUser({database: database});
    }

    /**
     * Check if a database exists
     * @param database String: name of the database
     * @param createClean Boolean: Whether to create a clean database using the wipe SQL
     */
    public async databaseExists(database: string, createClean: boolean = false): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.sendQuery(`SHOW DATABASES LIKE '${database}';`).then(async (value) => {
                // If not and wipe argument weren't given recreate it
                if (value.results.length === 0 || createClean) {
                    if (value.results.length === 0) console.log(`[MySQL] Database ${database} doesn't exist`);
                    console.log(`[MySQL] Creating clean version`);
                    let success = await wipeDatabase();
                    if (success) {
                        console.log(`[MySQL] Database ${database} has been created`);
                        return resolve(true);
                    } else {
                        console.log(`[MySQL] Database ${database} couldn't be created`);
                        return resolve(false);
                    }
                }
                return resolve(true);
            });
        });
    }

    /**
     * Creates a string with the sql query condition
     * @param where Where: condition includes column to check and what to check against
     * @return String: of the condition or an empty string if where is empty
     * @private
     */
    public createWhereString(where?:Where): string {
        return where !== undefined ? "WHERE " + where.column + " in ('" + where.equals.toString().replace(/(?<![\)']),'|(?<![\)']),(?![\('])|',(?![\('])/g, "','") + "')" : "";
    }

    /**
     * Creates a string with the sql query condition based on a list of where's
     * @param where Where[]: A list of conditions which includes column to check and what to check against
     * @return String: of the condition or an empty string if where is empty
     * @private
     */
    public createWhereListString(where: Where[]): string {
        let whereString: string = "WHERE ";
        for (let i = 0; i < where.length; i++) {
            if (i !== 0) whereString += " AND "
            whereString += where[i].column + "='" + where[i].equals[0].toString() + "'";
        }
        return whereString;
    }

    private stringListToStringConverter(list: string[]): string {
        let string: string = "";
        for (let i = 0; i < list.length; i++) {
            if (i !== 0) string += ","
            string += `'${list[i].replace(/\'/g, '"')}'`;
        }
        return string;
    }

    /**
     * Creates a string of all insert values
     * @param values string[][] | string[]: a list of all values to insert
     * @return String: string of all insert values
     * @private
     */
    public createValuesString(values: string[][] | string[]): string {
        let valuesString: string = "";
        if (Array.isArray(values[0])) {
            for (let i = 0; i < values.length; i++) {
                if (Array.isArray(values[i])) {
                    if (i !== 0) valuesString += ",";
                    // @ts-ignore
                    valuesString += `(${this.stringListToStringConverter(values[i])})`;
                }
            }
        } else {
            // @ts-ignore
            valuesString += `(${this.stringListToStringConverter(values)})`;
        }

        return valuesString;
    }

    private createUpdateSetString(updateSet: UpdateSet[]): string[] {
        let setString: string[] = [];
        for (const set of updateSet) {
            setString.push(`${set.column}="${set.value}"`);
        }
        return setString;
    }

    /**
     * Sends a query to the database if one is present
     * @param sqlQuery String: query to send to server
     * @private
     */
    public async sendQuery(sqlQuery: string): Promise<MySQLResponse>{
        if (this.hasOrCreateConnection()) {
            let promise:Promise<MySQLResponse> = new Promise<MySQLResponse>((resolve) =>  {
                MysqlHandler.connection.query({ sql: sqlQuery, timeout: 30000 }, (error: QueryError | null, results: any, fields: Field[]) => {
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
            if (this.logQueries) console.log("[MySQL] Retrieving data from DB, query: ", sqlQuery);
            return promise;
        }
        return {error: null, results: null, fields: null};
    }

    /**
     * Reads an SQL file
     * @param file String: path of file
     * @param database String: name of database to replace with in file
     * @private
     */
    private fsReadSQL(file: string, database: string = MysqlHandler.database): string {
        return fs.readFileSync(path.join(__dirname, file), {encoding: "utf-8"})
            .replace(/\$\{db\}/g, database); // Replace db with actual db/schema name
    }

    /**
     * Reads an SQL file and sends it as a query
     * @param file String: path of file
     * @constructor
     */
    public async SQLFileQuery(file: string): Promise<MySQLResponse> {
        if (/.*\.SQL(?!.)/g.test(file)) {
            let query: string = this.fsReadSQL(file);
            return mysqlHandler.sendQuery(query);
        }
        return {error: {
                code: "404", errno: 404, fatal: true, name: "File not an SQL file", message: "File cannot be send, as it's not a MySQL file"},
            results: null,
            fields: null};
    }

    /**
     * Sends a select query to server
     * @param table String: table to get data from
     * @param columns String[]?: column(s) to retrieve
     * @param where Where?: condition for the selection of data
     */
    public select(table: string, columns?: string[], where?: Where | Where[]): Promise<MySQLResponse> {
        let queryString: string;
        if (Array.isArray(where)) {
            queryString = `SELECT ${columns !== undefined ? columns : "*"} FROM ${table} ${this.createWhereListString(where)}`;
        } else {
            queryString = `SELECT ${columns !== undefined ? columns : "*"} FROM ${table} ${this.createWhereString(where)}`;
        }
        return this.sendQuery(queryString);
    }

    /**
     * Sends an insert query to server
     * @param table String: table to get data from
     * @param columns String[]: column(s) to insert into
     * @param values string[][] | string[]: values to insert into columns
     */
    public insert(table: string, columns: string[], values: string[][] | string[]): Promise<MySQLResponse> {
        let queryString = `INSERT IGNORE INTO ${table} (${columns}) VALUES ${this.createValuesString(values)}`;
        return this.sendQuery(queryString);
    }

    /**
     * Sends an update query to DB
     * @param table String: table to update data in
     * @param updateSet UpdateSet[]?: columns and the value to alter in the table
     * @param where Where?: condition for which rows to edit in table
     */
    public update(table: string, updateSet: UpdateSet[], where: Where |  Where[]): Promise<MySQLResponse> {
        let queryString: string;
        if (Array.isArray(where)) {
            queryString = `UPDATE ${table} SET ${this.createUpdateSetString(updateSet)} ${this.createWhereListString(where)}`;
        } else {
            queryString = `UPDATE ${table} SET ${this.createUpdateSetString(updateSet)} ${this.createWhereString(where)}`;
        }
        return this.sendQuery(queryString);
    }

    public remove(table: string, where: Where[]) {
        let queryString = `DELETE FROM ${table} ${this.createWhereListString(where)}`;
        return this.sendQuery(queryString);
    }

    /**
     * Converts numeric date to a string date MySQL understands (datetime, date)
     * @param date Number: date in numeric form
     */
    public dateFormatter(date:number): string {
        return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    }

    /**
     * Converts date to a date in numeric form
     * @param date Date: a date...
     */
    public dateToNumber(date: Date): number {
        return date.getTime();
    }
}

export default MysqlHandler;