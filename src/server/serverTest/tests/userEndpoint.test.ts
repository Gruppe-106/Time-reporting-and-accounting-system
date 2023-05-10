import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {authKey} from "../testBaseConfig";
const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");

describe("User API", () => {
    describe("User GET API", () => {
        test("User fail case", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/user/get", {authKey: authKey}, (value) => {
                    expect(value["message"]).toMatch("Bad Request");
                    resolve(true);
                });
            });
        });

        test("Success GET message with single ID", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/user/get?ids=11", {authKey: authKey}, (value) => {
                    expect(value).toStrictEqual({
                        "status": 200,
                        "data": [
                            {id: 11, email: 'userget1@example.com', firstName: 'User', lastName: 'Get1', groupId: 1}
                        ]
                    });
                    resolve(true);
                });
            });
        });

        test("Success GET message with multiple IDs", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/user/get?ids=11,12", {authKey: authKey}, (value) => {
                    expect(value).toStrictEqual({
                        "status": 200,
                        "data": [
                            {id: 11, email: 'userget1@example.com', firstName: 'User', lastName: 'Get1', groupId: 1},
                            {id: 12, email: 'userget2@example.com', firstName: 'User', lastName: 'Get2', groupId: 1}
                        ]
                    });
                    resolve(true);
                });
            });
        });

        test("Success GET all", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/user/get?ids=*", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value["data"].length).toBeGreaterThanOrEqual(1);
                    resolve(true);
                });
            });
        });
    });

    describe("User POST API", () => {
        test.concurrent("Success case", async () => {
            let bodySuccess = {
                firstName   : "Test",
                lastName    : "Test",
                email       : "test@test.com",
                password    : "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                manager     : 1,
                roles       : [1]
            }

            await new Promise((resolve) => {
                apiHandler.post("/api/user/creation/post", {authKey: authKey, body: bodySuccess}, (value) => {
                    expect(value).toStrictEqual({ status: 200, data: { success: 'true', message: [ 'success' ] } });
                    resolve(true);
                })
            });
        }, 10000);

        test("Fail case bad email", async () => {
            let bodyFail = {
                firstName   : "Test",
                lastName    : "Test",
                email       : "testtest.com",
                password    : "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                manager     : 1,
                roles       : [1]
            }

            await new Promise((resolve) => {
                apiHandler.post("/api/user/creation/post", {authKey: authKey, body: bodyFail}, (value) => {
                    expect(value["status"]).toBe(404);
                    expect(value["data"]["error"]).toBe("Failed to submit data");
                    resolve(true);
                });
            });
        });

        test("Fail case", async () => {
            let bodyFail = {
                firstName   : "Test",
                lastName    : "Test",
                manager     : 2,
                roles       : [1]
            }
            await new Promise((resolve) => {
                apiHandler.post("/api/user/creation/post", {authKey: authKey, body: bodyFail}, (value) => {
                    expect(value["status"]).toBe(404);
                    expect(value["data"]["error"]).toBe("Failed to submit data");
                    resolve(true);
                });
            });
        });
    });

    describe("User PUT API", () => {
       test("Fail case", async () => {
           let bodyFail = {
               firstName   : "Test",
               lastName    : "Fail",
               email       : "fail@test.com",
           };

           await new Promise((resolve) => {
               apiHandler.put("/api/user/edit/put", {authKey: authKey, body: bodyFail}, (value) => {
                   expect(value["data"]["success"]).toBe("false");
                   resolve(true);
               });
           });
       });

        test("Success case", async () => {
            let bodyFail = {
                userId      : 13,
                firstName   : "UserPut",
                lastName    : "Edited",
                email       : "edited@test.com",
            };
            await new Promise((resolve) => {
                apiHandler.put("/api/user/edit/put", {authKey: authKey, body: bodyFail}, (value) => {
                    expect(value["data"]["success"]).toMatch("true");
                    resolve(true);
                });
            });
        });
    });
});