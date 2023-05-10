import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {authKey} from "../testBaseConfig";
const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");

describe("Time-type API", () => {
    describe("GET API", () => {
        // Try to get a role without an id
        test("Fail case", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/time/register/get", {authKey: authKey}, (value) => {
                    expect(value["message"]).toMatch("Bad Request");
                    resolve(true);
                });
            });
        });

        // Try to get a role with an id
        test("Success case time-type one id", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/time/register/get?user=9", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value).toStrictEqual(
                        {
                            status: 200,
                            data: [
                                {
                                    date: 1672527600000,
                                    taskId: 3,
                                    userId: 9,
                                    time: 30,
                                    approved: 0,
                                    managerLogged: 0,
                                    taskName: 'Task Get Task',
                                    projectId: 5,
                                    projectName: 'Project Task Post',
                                    timeType: 1,
                                    timeTypeName: "billable"
                                },
                                {
                                    date: 1701385200000,
                                    taskId: 3,
                                    userId: 9,
                                    time: 60,
                                    approved: 0,
                                    managerLogged: 0,
                                    taskName: 'Task Get Task',
                                    projectId: 5,
                                    projectName: 'Project Task Post',
                                    timeType: 1,
                                    timeTypeName: "billable"
                                }
                            ]
                        });
                    resolve(true);
                });
            });
        });

        test("Success case time-type one id", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/time/register/get?user=9&var=date,taskId,projectId,projectName", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value).toStrictEqual(
                        {
                            status: 200,
                            data: [
                                {
                                    date: 1672527600000,
                                    taskId: 3,
                                    projectId: 5,
                                    projectName: 'Project Task Post'
                                },
                                {
                                    date: 1701385200000,
                                    taskId: 3,
                                    projectId: 5,
                                    projectName: 'Project Task Post'
                                }
                            ]
                        });
                    resolve(true);
                });
            });
        });

        // Try to get a role with *
        test("Success case with period", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/time/register/get?user=9&period=1698796800000,1703980800000", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value).toStrictEqual({
                        status: 200,
                        data: [
                            {
                                date: 1701385200000,
                                taskId: 3,
                                userId: 9,
                                time: 60,
                                approved: 0,
                                managerLogged: 0,
                                taskName: 'Task Get Task',
                                projectId: 5,
                                projectName: 'Project Task Post',
                                timeType: 1,
                                timeTypeName: "billable"
                            }
                        ]
                    });
                    resolve(true);
                });
            });
        });
    });

    describe("POST API", () => {
        test("Fail case no body", async () => {
            await new Promise((resolve) => {
                apiHandler.post("/api/time/register/post", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(404);
                    expect(value["data"]["message"]).toMatch("Missing Body");
                    expect(value["data"]["success"]).toMatch("false");
                });
            });
        });

        let bodyFail = {
            date : 1679529600000,
            time : 1,
        }

        test("Fail case wrong body", async () => {
            await new Promise((resolve) => {
                apiHandler.post("/api/time/register/post", {authKey: authKey, body: bodyFail}, (value) => {
                    expect(value["status"]).toBe(404);
                    resolve(true);
                })
            });
        });

        let bodySuccess = {
            date   : 1692403200000,
            taskId : 1,
            userId : 1,
            time   : 30
        }

        test("Success case", async () => {
            await new Promise((resolve) => {
                apiHandler.post("/api/time/register/post", {authKey: authKey, body: bodySuccess}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value["data"]["message"][0]).toBe("success");
                    expect(value["data"]["success"]).toMatch("true");
                    resolve(true);
                })
            });
        });
    });

    describe("PUT API", () => {
        test("Fail case", async () => {
            await new Promise((resolve) => {
                apiHandler.put("/api/time/register/edit/put", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(404);
                    expect(value["data"]["message"]).toMatch("Missing Body");
                    expect(value["data"]["success"]).toMatch("false");
                    resolve(true);
                });
            });
        });

        test("Fail case, invalid body", async () => {
            let bodyFail = {
                date          : 1679529600000,
                taskId        : 4,
                time          : 30,
            }
            await new Promise((resolve) => {
                apiHandler.put("/api/time/register/edit/put", {authKey: authKey, body: bodyFail}, (value) => {
                    expect(value["status"]).toBe(404);
                    resolve(true);
                });
            });
        });

        test("Success case", async () => {
            let bodySuccess = {
                date          : 1672531200000,
                taskId        : 4,
                userId        : 10,
                time          : 60,
                approved      : 1,
                managerLogged : 1
            }
            await new Promise((resolve) => {
                apiHandler.put("/api/time/register/edit/put", {authKey: authKey, body: bodySuccess}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value["data"]["success"]).toMatch("true");
                    resolve(true);
                });
            });
        });
    });
});