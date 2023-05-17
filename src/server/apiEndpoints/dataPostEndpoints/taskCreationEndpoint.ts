import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {createAndAddTasksToProject} from "./tablePosts/taskProject";
import {TaskData} from "./tablePosts/taskTable";

export interface TaskCreationData {
    projectId: number,
    task: TaskData
}

class TaskCreationEndpoint extends PostEndpointBase {
    requiredRole: number = 3;

    /**
     * @brief Submits task creation data to the server
     * @param req - The request object
     * @param res - The response object
     * @return A promise that resolves to an array of strings, with "success" if successful
     */
    async submitData(req: Request, res: Response): Promise<string[]> {
        // Extract task creation data from request body
        let tasksData: TaskCreationData = req.body;

        // If task data is not provided, return an error message
        if (!tasksData.task) return ["Task data not given"];

        // If task data is provided, create and add tasks to project
        await createAndAddTasksToProject.call(this, [tasksData.task], tasksData.projectId);

        // Return success message
        return Promise.resolve(["success"]);
    }
}

export default TaskCreationEndpoint;