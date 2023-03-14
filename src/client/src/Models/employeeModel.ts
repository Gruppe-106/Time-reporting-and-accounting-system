import BaseModel from "./baseModel";

interface UserData {
    id:number;
    email:String;
    firstName:String;
    lastName:String;
    group:number;
}

class UserModel extends BaseModel<UserData> {
    GetAllModels(): Promise<UserData[]> {
        throw (new Error("Not implemented"));
    }

    GetModelById(id: number): Promise<UserData> {
        throw (new Error("Not implemented"));
    }

}