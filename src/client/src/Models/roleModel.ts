import BaseModel from "./baseModel";

interface RoleModelData {
    id:number;
    name:string;
}

class RoleModel extends BaseModel<RoleModelData> {
    public static idCounterDeleteMe:number = 0;

    GetAllModels(): Promise<RoleModelData[]> {
        return new Promise<RoleModelData[]>(async (resolve, reject) => {
            let r1:RoleModelData = {
                id: RoleModel.idCounterDeleteMe++,
                name: "admin"
            }
            let r2:RoleModelData = {
                id: RoleModel.idCounterDeleteMe++,
                name: "project leader"
            }
            let r3:RoleModelData = {
                id: RoleModel.idCounterDeleteMe++,
                name: "employee"
            }
            let r4:RoleModelData = {
                id: RoleModel.idCounterDeleteMe++,
                name: "code monkey"
            }
            let rData = [
                r1, r2, r3, r4
            ]

            await setTimeout(() => {
                resolve(rData);
            }, 3000);
        })
    }

    GetModelById(id: number): Promise<RoleModelData> {
        throw (new Error("Not implemented"));
    }
}

export default RoleModel;