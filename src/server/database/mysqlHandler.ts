import * as mysql from "mysql2";
import {createConnection, Field, Pool, QueryError} from "mysql2";
import {wipeDatabase} from "./wipeDB";
import * as fs from "fs";
import {mysqlHandler} from "../../app";

export interface MySQLConfig {
    host               : string,
    user               : string,
    password           : string,
    database           : string,
    waitForConnections : boolean,
    connectionLimit    : number,
    maxIdle            : number,
    idleTimeout        : number,
    queueLimit         : number
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
    private logQueries                 : boolean = false;
    private static connectionConfig    : MySQLConfig;
    private static connectionPool      : Pool;
    public static readonly database    : string = "timemanagerdatabase";
    public static readonly testDatabase: string = "testdb";

    constructor(connectionConfig: MySQLConfig, testMode: boolean = false) {
        if (connectionConfig !== undefined) { MysqlHandler.connectionConfig = connectionConfig; }
        // Change database if server is in test mode
        if (testMode) { MysqlHandler.connectionConfig.database = MysqlHandler.testDatabase; }
    }

    /**
     * Initializes connection to database and ensures database exists
     * @param mysqlOnConnectCallback Callback: Callback when successful
     */
    public async initConnection(mysqlOnConnectCallback: () => void): Promise<void> {
        // Check if database exists or create if not
        let success: boolean = await this.databaseExists(MysqlHandler.database, process.argv.indexOf("wipe") !== -1);
        if (!success) return;
        // If successful create a pool connection and run callback
        if (!await this.hasOrCreatePool()) {
            MysqlHandler.connectionPool = undefined;
        }
        mysqlOnConnectCallback();
    }

    /**
     * @return Boolean: Returns whether a MySQL connection is present or not
     */
    public hasConnection(): boolean {
        return MysqlHandler.connectionPool !== undefined;
    }

    /** Tries to create a connection to a MySQL database if one doesn't exist
     * @return Boolean: Returns whether a MySQL connection is present or not
     * @private
     */
    private async createPool(): Promise<boolean> {
        if (MysqlHandler.connectionConfig !== undefined) {
            // Create a pool
            MysqlHandler.connectionPool = mysql.createPool(MysqlHandler.connectionConfig);
            // Test if pool can connect to database
            return await new Promise((resolve, reject) => {
                MysqlHandler.connectionPool.getConnection((err, connection) => {
                    if (err === null) {
                        console.log("[MySQL] Successfully created a pool connection to database");
                        resolve(true);
                    }
                    resolve(false);
                })
            })
        }
        return false;
    }

    /** Checks if connection is present, if not try to create one
     * @return Boolean: Returns true if connection is present otherwise false
     */
    public async hasOrCreatePool(): Promise<boolean> {
        if (!this.hasConnection()) {
            return await this.createPool();
        }
        return true;
    }

    /**
     * Stops connection to the mysql server
     */
    public destroyConnection(): void {
        if (this.hasConnection()) {
            MysqlHandler.connectionPool.destroy();
            return console.log("[MySQL] Connection to database destroyed");
        }
        console.log("[MySQL] No connection to destroy")
    }

    /**
     * Check if a database exists
     * @param database String: name of the database
     * @param createClean Boolean: Whether to create a clean database using the wipe SQL
     */
    public async databaseExists(database: string, createClean: boolean = false): Promise<boolean> {
        // Create a config for connection
        // Other elements in the original config is for pool connections
        let connectionConfig = {
            multipleStatements: true,
            host     : MysqlHandler.connectionConfig.host,
            user     : MysqlHandler.connectionConfig.user,
            password : MysqlHandler.connectionConfig.password,
        }
        // Create a connection to the database
        const connection: mysql.Connection = createConnection(connectionConfig);
        await connection.connect();

        // Test if the database exists or try to create one
        let result = new Promise<boolean>(async (resolve) => {
            connection.query(`SHOW DATABASES LIKE '${database}';`,async (err, result, fields) => {
                // If length of result is not 0, then a database has been found with the specified name
                if (Array.isArray(result)) {
                    if (result.length === 0 || createClean) {
                        if (result.length === 0) console.log(`[MySQL] Database ${database} doesn't exist`);
                        console.log(`[MySQL] Creating clean version`);
                        // Try to create database
                        let success = await wipeDatabase();
                        if (success) {
                            console.log(`[MySQL] Database ${database} has been created`);
                            return resolve(true);
                        } else {
                            console.log(`[MySQL] Database ${database} couldn't be created`);
                            return resolve(false);
                        }
                    }
                }
                return resolve(true);
            });
        });
        // Destroy connection as it will be not used anymore
        connection.destroy();
        return result;
    }

    /**
     * Creates a string with the sql query condition
     * @param where Where: condition includes column to check and what to check against
     * @return String: of the condition or an empty string if where is empty
     * @private
     */
    public createWhereString(where?:Where): string {
        return where !== undefined ? "WHERE " + where.column + " IN ('" + where.equals.toString().replace(/(?<![\)']),'|(?<![\)']),(?![\('])|',(?![\('])/g, "','") + "')" : "";
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
        if (this.hasOrCreatePool()) {
            let promise:Promise<MySQLResponse> = new Promise<MySQLResponse>((resolve) =>  {
                MysqlHandler.connectionPool.query({ sql: sqlQuery, timeout: 30000 }, (error: QueryError | null, results: any, fields: Field[]) => {
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
     * @param path String: path of file
     * @param database String: name of database to replace with in file
     * @private
     */
    private fsReadSQL(path: string, database: string = MysqlHandler.database): string {
        return fs.readFileSync(path, {encoding: "utf-8"})
            .replace(/\$\{db\}/g, database); // Replace db with actual db/schema name
    }

    /**
     * Reads an SQL file and sends it as a query
     * @param path String: path of file
     * @param database String: name of database to replace with in file
     * @constructor
     */
    public async SQLFileQuery(path: string, database: string = MysqlHandler.database): Promise<MySQLResponse> {
        if (/.*\.SQL(?!.)/g.test(path)) {
            let query: string = this.fsReadSQL(path, database);
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