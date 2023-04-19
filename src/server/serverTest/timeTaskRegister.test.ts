import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

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
            await apiHandler.get("/api/time/register/get?user=1", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual(
                    {
                        status: 200,
                        data: [
                            {
                                date: 1679526000000,
                                taskId: 2,
                                userId: 1,
                                time: 120,
                                approved: 0,
                                managerLogged: 0,
                                taskName: 'Task Y',
                                projectId: 2,
                                projectName: 'Project Beta'
                            },
                            {
                                date: 1679612400000,
                                taskId: 2,
                                userId: 1,
                                time: 60,
                                approved: 1,
                                managerLogged: 1,
                                taskName: 'Task Y',
                                projectId: 2,
                                projectName: 'Project Beta'
                            },
                            {
                                date: 1679785200000,
                                taskId: 2,
                                userId: 1,
                                time: 120,
                                approved: 0,
                                managerLogged: 1,
                                taskName: 'Task Y',
                                projectId: 2,
                                projectName: 'Project Beta'
                            },
                            {
                                date: 1679439600000,
                                taskId: 3,
                                userId: 1,
                                time: 30,
                                approved: 1,
                                managerLogged: 1,
                                taskName: 'Task Z',
                                projectId: 3,
                                projectName: 'Project Gamma'
                            },
                            {
                                date: 1679526000000,
                                taskId: 3,
                                userId: 1,
                                time: 120,
                                approved: 1,
                                managerLogged: 1,
                                taskName: 'Task Z',
                                projectId: 3,
                                projectName: 'Project Gamma'
                            },
                            {
                                date: 1679612400000,
                                taskId: 3,
                                userId: 1,
                                time: 120,
                                approved: 0,
                                managerLogged: 0,
                                taskName: 'Task Z',
                                projectId: 3,
                                projectName: 'Project Gamma'
                            }
                        ]
                    });
            });
        });

        // Try to get a role with *
        test("Success case time-type all", async () => {
            await apiHandler.get("/api/time/register/get?user=3,4,5", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual({
                    status: 200,
                    data: [
                        {
                            date: 1680559200000,
                            taskId: 1,
                            userId: 5,
                            time: 120,
                            approved: 0,
                            managerLogged: 0,
                            taskName: 'Task X',
                            projectId: 1,
                            projectName: 'Project Alpha'
                        },
                        {
                            date: 1679526000000,
                            taskId: 2,
                            userId: 4,
                            time: 120,
                            approved: 1,
                            managerLogged: 1,
                            taskName: 'Task Y',
                            projectId: 2,
                            projectName: 'Project Beta'
                        },
                        {
                            date: 1680386400000,
                            taskId: 2,
                            userId: 4,
                            time: 60,
                            approved: 0,
                            managerLogged: 0,
                            taskName: 'Task Y',
                            projectId: 2,
                            projectName: 'Project Beta'
                        },
                        {
                            date: 1679439600000,
                            taskId: 3,
                            userId: 3,
                            time: 90,
                            approved: 0,
                            managerLogged: 0,
                            taskName: 'Task Z',
                            projectId: 3,
                            projectName: 'Project Gamma'
                        },
                        {
                            date: 1679439600000,
                            taskId: 3,
                            userId: 4,
                            time: 60,
                            approved: 0,
                            managerLogged: 0,
                            taskName: 'Task Z',
                            projectId: 3,
                            projectName: 'Project Gamma'
                        },
                        {
                            date: 1679439600000,
                            taskId: 3,
                            userId: 5,
                            time: 120,
                            approved: 1,
                            managerLogged: 1,
                            taskName: 'Task Z',
                            projectId: 3,
                            projectName: 'Project Gamma'
                        },
                        {
                            date: 1679526000000,
                            taskId: 3,
                            userId: 3,
                            time: 60,
                            approved: 1,
                            managerLogged: 1,
                            taskName: 'Task Z',
                            projectId: 3,
                            projectName: 'Project Gamma'
                        },
                        {
                            date: 1679612400000,
                            taskId: 3,
                            userId: 3,
                            time: 30,
                            approved: 0,
                            managerLogged: 1,
                            taskName: 'Task Z',
                            projectId: 3,
                            projectName: 'Project Gamma'
                        },
                        {
                            date: 1679785200000,
                            taskId: 3,
                            userId: 4,
                            time: 120,
                            approved: 0,
                            managerLogged: 0,
                            taskName: 'Task Z',
                            projectId: 3,
                            projectName: 'Project Gamma'
                        },
                        {
                            date: 1679785200000,
                            taskId: 3,
                            userId: 5,
                            time: 150,
                            approved: 1,
                            managerLogged: 1,
                            taskName: 'Task Z',
                            projectId: 3,
                            projectName: 'Project Gamma'
                        },
                        {
                            date: 1680559200000,
                            taskId: 3,
                            userId: 5,
                            time: 180,
                            approved: 1,
                            managerLogged: 1,
                            taskName: 'Task Z',
                            projectId: 3,
                            projectName: 'Project Gamma'
                        },
                        {
                            date: 1679266800000,
                            taskId: 9,
                            userId: 4,
                            time: 60,
                            approved: 1,
                            managerLogged: 1,
                            taskName: 'Task F',
                            projectId: 4,
                            projectName: 'Project Delta'
                        },
                        {
                            date: 1679353200000,
                            taskId: 9,
                            userId: 4,
                            time: 30,
                            approved: 1,
                            managerLogged: 1,
                            taskName: 'Task F',
                            projectId: 4,
                            projectName: 'Project Delta'
                        },
                        {
                            date: 1679698800000,
                            taskId: 9,
                            userId: 4,
                            time: 30,
                            approved: 1,
                            managerLogged: 1,
                            taskName: 'Task F',
                            projectId: 4,
                            projectName: 'Project Delta'
                        },
                        {
                            date: 1680040800000,
                            taskId: 9,
                            userId: 3,
                            time: 60,
                            approved: 0,
                            managerLogged: 0,
                            taskName: 'Task F',
                            projectId: 4,
                            projectName: 'Project Delta'
                        },
                        {
                            date: 1680300000000,
                            taskId: 9,
                            userId: 3,
                            time: 120,
                            approved: 0,
                            managerLogged: 0,
                            taskName: 'Task F',
                            projectId: 4,
                            projectName: 'Project Delta'
                        },
                        {
                            date: 1680386400000,
                            taskId: 9,
                            userId: 3,
                            time: 60,
                            approved: 0,
                            managerLogged: 0,
                            taskName: 'Task F',
                            projectId: 4,
                            projectName: 'Project Delta'
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
            date          : 1679529600000,
            time          : 1,
        }

        test("Fail case wrong body", () => {
            apiHandler.post("/api/time/register/post", {headers: headers, body: bodyFail}, (value) => {
                expect(value["status"]).toBe(404);
            })
        });

        let bodySuccess = {
            date          : 1692403200000,
            taskId        : 1,
            userId        : 6,
            time          : 30
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
                taskId        : 2,
                time          : 1,
            }

            apiHandler.put("/api/time/register/edit/put", {headers: headers, body: bodyFail}, (value) => {
                expect(value["status"]).toBe(404);
            });
        });

        test("Success case", () => {
            let bodySuccess = {
                date          : 1679356800000,
                taskId        : 3,
                userId        : 2,
                time          : 10,
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