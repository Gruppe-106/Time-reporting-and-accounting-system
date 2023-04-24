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
     * @param where - An optional where string to append to
     * @param tableIdentifier - An optional identifier for the table
     * @returns The current instance of the MysqlQueryBuilder
     * @description Remember to add table identifier e.g. userId from table USERS u should be u.userId
     */
    from(table: string, condition?: [key: string, equals: string[]], where?: string, tableIdentifier?: string): MysqlQueryBuilder {
        if (where !== undefined)
            this.query.from = `FROM (SELECT * FROM ${table} ${where}) ${tableIdentifier}`;
        else
            this.query.from = `FROM (SELECT * FROM ${table} ${this.where(condition)}) ${tableIdentifier}`;
        return this;
    }


    /**
     * Generate a WHERE clause for the query
     * @param condition - An optional array containing a key-value pair to filter the results by
     * @param currentWhere - An optional where string to append to
     * @returns A string representing the WHERE clause of the query
     * @description Remember to add table identifier e.g. userId from table USERS u should be u.userId
     */
    where(condition?: [key: string, equals: string[]], currentWhere?: string): string {
        if (condition === undefined || condition[1].indexOf("*") !== -1) return "";
        let values: string[] = condition[1].map(value => {return `'${value}'`;});
        let conditionString:string = `${condition[0]} IN (${values})`;
        if (values.length === 1) conditionString = ` ${condition[0]}=${values}`
        if (currentWhere !== undefined) return currentWhere + " AND " + conditionString
        return `WHERE ` + conditionString;
    }

    /**
     * Generate a WHERE clause for the query
     * @param betweenDates - An optional array containing a key-value pair to filter the results by date range
     * @param currentWhere - An optional where string to append to
     * @returns A string representing the WHERE clause of the query
     */
    whereDates(betweenDates?: [key: string, start: string, end: string], currentWhere?: string): string {
        if (betweenDates === undefined) return currentWhere;
        if (currentWhere !== undefined) return currentWhere + ` AND ${betweenDates[0]} BETWEEN '${betweenDates[1]}' AND '${betweenDates[2]}'`;
        return `WHERE ${betweenDates[0]} BETWEEN '${betweenDates[1]}' AND '${betweenDates[2]}'`;
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
    groupBy(columns: string): MysqlQueryBuilder {
        this.query.groupBy.push(`GROUP BY ${columns}`);
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


