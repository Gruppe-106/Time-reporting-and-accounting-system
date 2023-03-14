import BaseModel from "./baseModel";

interface TimeTypeData {
    id:number;
    name:string;
}

class TimeTypeModel extends BaseModel<TimeTypeData> {
    public static idCounterDeleteMe:number = 0;

    GetAllModels(): Promise<TimeTypeData[]> {
        return new Promise<TimeTypeData[]>( async (resolve, reject) => {
            let t1:TimeTypeData = {
                id: TimeTypeModel.idCounterDeleteMe++,
                name: "holiday"
            }
            let t2:TimeTypeData = {
                id: TimeTypeModel.idCounterDeleteMe++,
                name: "absence"
            }
            let t3:TimeTypeData = {
                id: TimeTypeModel.idCounterDeleteMe++,
                name: "sickness"
            }
            let t4:TimeTypeData = {
                id: TimeTypeModel.idCounterDeleteMe++,
                name: "continuing education"
            }
            let tData:TimeTypeData[] = [
                t1, t2, t3, t4
            ]

            await setTimeout(() => {
                resolve(tData)
            }, 3000);
        })
    }

    GetModelById(id: number): Promise<TimeTypeData> {
        throw (new Error("Not implemented"));
    }
}

export default TimeTypeModel;