import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {TaskCreationData} from "../../apiEndpoints/dataPostEndpoints/taskCreationEndpoint";
import {authKey} from "../testBaseConfig";
const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");

describe("Task API", () => {
    describe("Task GET API", () => {
        test("Fail get message", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/task/get", {authKey: authKey}, (value) => {
                    expect(value["message"]).toMatch("Bad Request");
                    resolve(true);
                });
            });
        });

        test("Success get message with single ID", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/task/get?ids=1", {authKey: authKey}, (value) => {
                    expect(value).toStrictEqual({
                        status: 200,
                        data: [
                            {
                                name: 'Project Info Task',
                                id: 1,
                                startDate: 1679266800000,
                                endDate: 1682460000000,
                                timeType: 1
                            }
                        ]
                    });
                });
                resolve(true);
            });
        });

        test("Success get message with multiple IDs", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/task/get?ids=1,2", {authKey: authKey}, (value) => {
                    expect(value).toStrictEqual({
                        status: 200,
                        data: [
                            {
                                name: 'Project Info Task',
                                id: 1,
                                startDate: 1679266800000,
                                endDate: 1682460000000,
                                timeType: 1
                            },
                            {
                                name: 'Task Get Task',
                                id: 2,
                                startDate: 1679266800000,
                                endDate: 1682460000000,
                                timeType: 1
                            }
                        ]
                    });
                    resolve(true);
                });
            });
        });
    });

    describe("Task Creation API", () => {
        test("Success case", async () => {
            let bodySuccess: TaskCreationData = {
                projectId: 4,
                task: {
                    name: "Task test Post",
                    userId: [8],
                    startDate: 1679266800000,
                    endDate: 1682460000000,
                    timeType: 1
                }
            }
            await new Promise((resolve) => {
                apiHandler.post("/api/task/creation/post", {authKey: authKey, body: bodySuccess}, (value) => {
                    expect(value["data"]["success"]).toMatch("true");
                    resolve(true);
                });
            });
        });

        test("Fail case", async () => {
            let bodyFail = {
                userId: [1,2,3],
                startDate: 1679266800000,
                endDate: 1682460000000,
                timeType: 1
            }
            await new Promise((resolve) => {
                apiHandler.post("/api/task/creation/post", {authKey: authKey, body: bodyFail}, (value) => {
                    expect(value["status"]).toBe(404);
                    resolve(true);
                });
            });
        });
    });
});
