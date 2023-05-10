import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {authKey} from "../testBaseConfig";
const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");

describe("project/task API", () => {
    // Try to get a project/task without an id
    test("Fail case", async () => {
        await new Promise((resolve) => {
            apiHandler.get("/api/task/project/get", {authKey: authKey}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
                resolve(true);
            });
        });
    });

    test("Success Task", async () => {
        await new Promise((resolve) => {
            apiHandler.get("/api/task/project/get?task=1", {authKey: authKey}, (value) => {
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [
                        {
                            "taskId": 1,
                            "projectId": 3,
                            "taskName": "Project Info Task",
                            "projectName": "Project Info Test"
                        }
                    ]
                });
                resolve(true);
            });
        });
    });

    test("Success Project", async () => {
        await new Promise((resolve) => {
            apiHandler.get("/api/task/project/get?project=3", {authKey: authKey}, (value) => {
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [
                        {
                            "taskId": 1,
                            "projectId": 3,
                            "taskName": "Project Info Task",
                            "projectName": "Project Info Test"
                        }
                    ]
                });
                resolve(true);
            });
        });
    });
});