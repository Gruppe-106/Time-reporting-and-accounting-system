import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {addTaskToProject} from "./projectCreationEndpoint";
import taskEditEndpoint from "../dataPutEndpoints/taskEditEndpoint";

export interface TaskData {
    name      : string,
    userId    : number[],
    startDate : number,
    endDate   : number,
    timeType  : number
}

interface TaskCreationData {
    projectId: number,
    task: TaskData
}

class TaskCreationEndpoint extends PostEndpointBase {
    requiredRole: number = 3;

    async submitData(req: Request, res: Response): Promise<string[]> {
        let tasksData: TaskCreationData = req.body;
        if (tasksData.task) await addTaskToProject.call(this, [tasksData.task], tasksData.projectId);

        return Promise.resolve(["success"]);
    }
}

export default TaskCreationEndpoint;