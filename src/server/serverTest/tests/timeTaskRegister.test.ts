import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {getConfig} from "../testBaseConfig";

const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = getConfig();

describe("Time-type API", () => {
    describe("GET API", () => {
        // Try to get a role without an id
        test("Fail case", async () => {
            await apiHandler.get("/api/time/register/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        // Try to get a role with an id
        test("Success case time-type one id", async () => {
            await apiHandler.get("/api/time/register/get?user=9", {headers: headers}, (value) => {
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
                                projectName: 'Project Task Post'
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
                                projectName: 'Project Task Post'
                            }
                        ]
                    });
            });
        });

        test("Success case time-type one id", async () => {
            await apiHandler.get("/api/time/register/get?user=9&var=date,taskId,projectId,projectName", {headers: headers}, (value) => {
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
            });
        });

        // Try to get a role with *
        test("Success case with period", async () => {
            await apiHandler.get("/api/time/register/get?user=9&period=1698796800000,1703980800000", {headers: headers}, (value) => {
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
                            projectName: 'Project Task Post'
                        }
                    ]
                });
            });
        });
    });

    describe("POST API", () => {
        test("Fail case no body", () => {
           apiHandler.post("/api/time/register/post", {headers: headers}, (value) => {
               expect(value["status"]).toBe(404);
               expect(value["data"]["message"]).toMatch("Missing Body");
               expect(value["data"]["success"]).toMatch("false");
           })
        });

        let bodyFail = {
            date : 1679529600000,
            time : 1,
        }

        test("Fail case wrong body", () => {
            apiHandler.post("/api/time/register/post", {headers: headers, body: bodyFail}, (value) => {
                expect(value["status"]).toBe(404);
            })
        });

        let bodySuccess = {
            date   : 1692403200000,
            taskId : 1,
            userId : 1,
            time   : 30
        }

        test("Success case", () => {
            apiHandler.post("/api/time/register/post", {headers: headers, body: bodySuccess}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value["data"]["message"][0]).toBe("success");
                expect(value["data"]["success"]).toMatch("true");
            })
        });
    });

    describe("PUT API", () => {
        test("Fail case", () => {
           apiHandler.put("/api/time/register/edit/put", {headers: headers}, (value) => {
               expect(value["status"]).toBe(404);
               expect(value["data"]["message"]).toMatch("Missing Body");
               expect(value["data"]["success"]).toMatch("false");
           });
        });

        test("Fail case, invalid body", () => {
            let bodyFail = {
                date          : 1679529600000,
                taskId        : 4,
                time          : 30,
            }

            apiHandler.put("/api/time/register/edit/put", {headers: headers, body: bodyFail}, (value) => {
                expect(value["status"]).toBe(404);
            });
        });

        test("Success case", () => {
            let bodySuccess = {
                date          : 1672531200000,
                taskId        : 4,
                userId        : 10,
                time          : 60,
                approved      : 1,
                managerLogged : 1
            }

            apiHandler.put("/api/time/register/edit/put", {headers: headers, body: bodySuccess}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value["data"]["success"]).toMatch("true");
            });
        });
    });
});