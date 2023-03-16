export interface User {
    authKey: string;
    id?: number;
    role?: Roles;
}

enum Roles {
    NORMAL,
    MANAGER,
    PROJECT_MANAGER,
    ADMIN
}

abstract class EndpointBase {
    private readonly user: User;
    private getRole:Roles[]
    private postRole:Roles[]

    abstract table:object[];
    abstract data:object[];

    constructor(user: User) {
        this.user = user;
    }

    //Needs to actually be implemented
    private ensureAuth():boolean {
        return this.user.authKey === "test";
    }

    public async processRequest(requestValues: string[], primaryKey:string, keyEqual?:string[], data?:string[]):Promise<object[]> {
        try {
            if (this.ensureAuth()) {
                return await this.getData(requestValues, this.user, primaryKey, keyEqual);
            }
        } catch (e) {
            console.error(e);
            return [{error: "Failed to get data"}];
        }
    }

    public async baseGetData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[], data?:string[]):Promise<object[]> {
        this.data = [];
        let dataIndex = 0;
        for (const entry of this.table) {
            if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1 || keyEqual.indexOf("*") !== -1) {
                this.data[dataIndex] = {}
                if (requestValues.indexOf("*") !== -1) {
                    this.data[dataIndex] = entry;
                } else {
                    for (const request of requestValues) {
                        if (entry[request]) this.data[dataIndex][request] = entry[request];
                    }
                }
                dataIndex++;
            }
        }
        return this.data;
    }

    abstract getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[], data?:string[]):Promise<object[]>;
}

export default EndpointBase;