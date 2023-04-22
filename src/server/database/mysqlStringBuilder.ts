/**
 * Enum for different types of SQL joins
 */
export enum MySQLJoinTypes {
    CROSS = "CROSS",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

interface Query {
    columns: string[],
    from: string,
    join: {
        type: MySQLJoinTypes,
        table: string,
        condition: string,
        identifier: string
    }[],
    groupBy: string[]
}

class MysqlQueryBuilder {
    query: Query;

    constructor() {
        this.query = {columns: [], from: "", join: [], groupBy: []};
    }

    /**
     * Add columns to the SELECT statement of the query
     * @param columns - An array of column names to add to the SELECT statement
     * @returns The current instance of the MysqlQueryBuilder
     * @description Remember to add table identifier e.g. userId from table USERS u should be u.userId
     */
    addColumnsToGet(columns: string[]): MysqlQueryBuilder {
        this.query.columns = this.query.columns.concat(columns);
        return this;
    }

    /**
     * Set the FROM clause of the query
     * @param table - The name of the table to select from
     * @param condition - An optional array containing a key-value pair to filter the results by
     * @param tableIdentifier - An optional identifier for the table
     * @returns The current instance of the MysqlQueryBuilder
     */
    from(table: string, condition?: [key: string, equals: string[]], tableIdentifier?: string): MysqlQueryBuilder {
        this.query.from = `FROM (SELECT * FROM ${table} ${this.where(condition)}) ${tableIdentifier}`;
        return this;
    }

    /**
     * Generate a WHERE clause for the query
     * @param condition - An optional array containing a key-value pair to filter the results by
     * @returns A string representing the WHERE clause of the query
     */
    where(condition?: [key: string, equals: string[]]): string {
        if (condition === undefined) return "";
        return `WHERE ${condition[0]} IN (${condition[1]})`;
    }

    /**
     * Add a table name to a column name if it doesn't already have one
     * @param columnOrTable - A string representing a column name or table name
     * @returns A string representing the column name with a table name prefix if necessary
     */
    addTableName(columnOrTable: string): string {
        if (columnOrTable.includes('.')) {
            return columnOrTable;
        }
        return `table${this.query.from.length}.${columnOrTable}`;
    }

    /**
     * Add a JOIN clause to the query
     * @param type - The type of JOIN to add
     * @param table - The name of the table to join
     * @param condition - An array containing a key-value pair to join the tables on
     * @param tableIdentifier - An optional identifier for the table
     * @returns The current instance of the MysqlQueryBuilder
     */
    join(type: MySQLJoinTypes, table: string, condition: [key: string, equals: string], tableIdentifier: string): MysqlQueryBuilder {
        const tableAlreadyJoined: boolean = this.query.join.some(join => join.table === table);
        if (!tableAlreadyJoined) {
            this.query.join.push({
                type: type,
                table: table,
                condition: `${condition[0]}=${condition[1]}`,
                identifier: tableIdentifier
            });
        }
        return this;
    }


    /**
     * Add a GROUP BY clause to the query
     * @param columns - A string or array of strings representing the columns to group by
     * @returns The current instance of the MysqlQueryBuilder
     */
    groupBy(columns: string | string[]): MysqlQueryBuilder {
        const uniqueColumns: string[] = Array.isArray(columns) ? columns.map(column => this.addTableName(column)) : [this.addTableName(columns)];
        this.query.groupBy.push(`GROUP BY ${uniqueColumns.join(', ')}`);
        return this;
    }

    /**
     * Build the final query string
     * @returns A string representing the final query
     */
    build(): string {
        const join: string = this.query.join.map(item => `${item.type} JOIN ${item.table} ${item.identifier} ON ${item.condition}`).join(' ');
        return `SELECT ${this.query.columns} ${this.query.from} ${join} ${this.query.groupBy}`;
    }
}

export default MysqlQueryBuilder;


