import BaseModel from "./baseModel";

export interface ProjectData {
    id:number;
    superProject:number;
    name:String;
    startDate:number;
    endDate:number;
}

class ProjectModel extends BaseModel<ProjectData> {
    public static idCounterDeleteMe:number = 0;

    public GetAllModels(): Promise<ProjectData[]> {
        return new Promise<ProjectData[]>(async (resolve, reject) => {
            let p1: ProjectData = {
                id: ProjectModel.idCounterDeleteMe++,
                superProject: -1,
                name: "P1",
                endDate: Date.now(),
                startDate: Date.now(),
            }
            let p2: ProjectData = {
                id: ProjectModel.idCounterDeleteMe++,
                superProject: p1.id,
                name: "P2",
                endDate: Date.now(),
                startDate: Date.now(),
            }
            let p3: ProjectData = {
                id: ProjectModel.idCounterDeleteMe++,
                superProject: p2.id,
                name: "P3",
                endDate: Date.now(),
                startDate: Date.now(),
            }
            let p4: ProjectData = {
                id: ProjectModel.idCounterDeleteMe++,
                superProject: p2.id,
                name: "P4",
                endDate: Date.now(),
                startDate: Date.now(),
            }
            let pDataList = [
                p1, p2, p3, p4
            ]

            await setTimeout(() => {resolve(pDataList)}, 3000);
        });
    }

    GetModelById(id: number): Promise<ProjectData> {
        throw (new Error("Not implemented"));
    }
}

export default ProjectModel;