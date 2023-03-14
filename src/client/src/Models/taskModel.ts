import BaseModel from "./baseModel";

interface TaskModelData {
    id:number;
    name:string;
    startDate:number;
    endDate:number;
    timeType:number;
}

class TaskModel extends BaseModel<TaskModelData> {
    public static idCounterDeleteMe:number = 0;

    GetAllModels(): Promise<TaskModelData[]> {
        return new Promise<TaskModelData[]>(async (resolve, reject) => {
            let tm1:TaskModelData = {
                id: TaskModel.idCounterDeleteMe++,
                name: "Do the problem analysis",
                startDate: Date.now(),
                endDate: Date.now(),
                timeType: 0,
            }
            let tm2:TaskModelData = {
                id: TaskModel.idCounterDeleteMe++,
                name: "Implement the project",
                startDate: Date.now(),
                endDate: Date.now(),
                timeType: 0,
            }
            let tm3:TaskModelData = {
                id: TaskModel.idCounterDeleteMe++,
                name: "Test the project",
                startDate: Date.now(),
                endDate: Date.now(),
                timeType: 0,
            }
            let tmData = [
                tm1, tm2, tm3
            ]

            await setTimeout(() => {
                resolve(tmData)
            }, 3000);
        })
    }

    GetModelById(id: number): Promise<TaskModelData> {
        throw (new Error("Not implemented"));
    }
}

export default TaskModel;