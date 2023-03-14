import BaseModel from "./baseModel";
import {ProjectData} from "./projectModel";

interface UserData {
    id:number;
    email:String;
    firstName:String;
    lastName:String;
    group:number;
}

class UserModel extends BaseModel<UserData> {
    public static idCounterDeleteMe:number = 0;

    public GetAllModels(): Promise<UserData[]> {
        return new Promise<UserData[]>(async (resolve, reject) => {
            let u1: UserData = {
                id: UserModel.idCounterDeleteMe++,
                email: "@gmail.com",
                firstName: "",
                lastName: "",
                group: 0,
            }
            let u2: UserData = {
                id: UserModel.idCounterDeleteMe++,
                email: "alexander@gmail.com",
                firstName: "Alexander",
                lastName: "Guldberg",
                group: 0,
            }
            let u3: UserData = {
                id: UserModel.idCounterDeleteMe++,
                email: "christian@gmail.com",
                firstName: "Christan",
                lastName: "Bonde",
                group: 0,
            }
            let u4: UserData = {
                id: UserModel.idCounterDeleteMe++,
                email: "simon@gmail.com",
                firstName: "Simon",
                lastName: "Nielsen",
                group: 0,
            }
            let u5: UserData = {
                id: UserModel.idCounterDeleteMe++,
                email: "mikkel@gmail.com",
                firstName: "Mikkel",
                lastName: "Helsing",
                group: 0,
            }
            let u6: UserData = {
                id: UserModel.idCounterDeleteMe++,
                email: "hvid@gmail.com",
                firstName: "Hvid",
                lastName: "Byriel",
                group: 0,
            }
            let u7: UserData = {
                id: UserModel.idCounterDeleteMe++,
                email: "mads@gmail.com",
                firstName: "Mads",
                lastName: "Kjerulff",
                group: 0,
            }
            let uDataList = [
                u1, u2, u3, u4, u5, u6, u7,
            ]

            await setTimeout(() => {resolve(uDataList)}, 3000);
        });
    }

    GetModelById(id: number): Promise<UserData> {
        throw (new Error("Not implemented"));
    }

}