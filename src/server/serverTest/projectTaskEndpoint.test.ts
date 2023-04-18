import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

interface  ProjectTaskData{
    status: number,
    data:
        {
            taskId?: number,
            taskName?: string,
            projectId?: number,
            projectName?: string,
        }[]
}

test("Testing project/task get api", async () => {
    // Try to get a project/task without an id
    apiHandler.get("/api/task/project/get", {headers: headers}, (value) => {
        expect(value["message"]).toMatch("Bad Request");
    });

    // Try to get a project/task without an id
    apiHandler.get("/api/task/project/get?task=3", {headers: headers}, (value) => {
        expect(value).toStrictEqual({
            "status": 200,
            "data": [
                {"taskId": 3, "projectId": 3, "taskName": "Task Z", "projectName": "Project Gamma"}
            ]
        });
    });
});