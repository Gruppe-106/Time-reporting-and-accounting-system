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

    constructor(user: User) {
        this.user = user;
    }

    //Needs to actually be implemented
    private ensureAuth():boolean {
        return this.user.authKey === "test";
    }

    public async processRequest(requestValues: string[], primaryKey:string, keyEqual?:string[]):Promise<object> {
        if (this.ensureAuth()) {
            return this.getData(requestValues, this.user, primaryKey, keyEqual);
        }
    }

    abstract getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]):object;
}

export default EndpointBase;