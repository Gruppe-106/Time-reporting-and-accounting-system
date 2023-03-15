import BaseModel from "./baseModel";

interface GroupModelData {
    id:number;
    managerId:number;
}

class GroupModel extends BaseModel<GroupModelData> {
    public static idCounterDeleteMe:number = 0;

    GetAllModels(): Promise<GroupModelData[]> {
        return new Promise<GroupModelData[]>(async (resolve, reject) => {
            let g1:GroupModelData = {
                id: GroupModel.idCounterDeleteMe++,
                managerId: 0,
            }
            let g2:GroupModelData = {
                id: GroupModel.idCounterDeleteMe++,
                managerId: 0,
            }
            let g3:GroupModelData = {
                id: GroupModel.idCounterDeleteMe++,
                managerId: 0,
            }
            let g4:GroupModelData = {
                id: GroupModel.idCounterDeleteMe++,
                managerId: 0,
            }
            let gData:GroupModelData[] = [
                g1, g2, g3, g4
            ]

            await setTimeout(() => {
                resolve(gData)
            }, 3000);
        })
    }

    GetModelById(id: number): Promise<GroupModelData> {
        throw (new Error("Not implemented"));
    }
}

export default GroupModel;