import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {getConfig} from "../testBaseConfig";

const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = getConfig();

describe("User API", () => {
    describe("User GET API", () => {
        test("User fail case", () => {
            apiHandler.get("/api/user/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        test("Success GET message with single ID", async () => {
            apiHandler.get("/api/user/get?ids=11", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    "status":200,
                    "data": [
                        {id: 11, email: 'userget1@example.com', firstName: 'User', lastName: 'Get1', groupId: 1}
                    ]
                });
            });
        });

        test("Success GET message with multiple IDs", async () => {
            apiHandler.get("/api/user/get?ids=11,12", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    "status":200,
                    "data": [
                        {id: 11, email: 'userget1@example.com', firstName: 'User', lastName: 'Get1', groupId: 1},
                        {id: 12, email: 'userget2@example.com', firstName: 'User', lastName: 'Get2', groupId: 1}
                    ]
                });
            });
        });

        test("Success GET all", async () => {
            apiHandler.get("/api/user/get?ids=*", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value["data"].length).toBeGreaterThanOrEqual(1);
            });
        });
    });

    describe("User POST API", () => {
        test("Success case", () => {
            let bodySuccess = {
                firstName   : "Test",
                lastName    : "Test",
                email       : "test@test.com",
                password    : "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                manager     : 1,
                roles       : [1]
            }

            apiHandler.post("/api/user/creation/post", {headers: headers, body: bodySuccess}, (value) => {
                expect(value).toStrictEqual({ status: 200, data: { success: 'true', message: [ 'success' ] } });
            });
        })

        test("Fail case bad email", () => {
            let bodyFail = {
                firstName   : "Test",
                lastName    : "Test",
                email       : "testtest.com",
                password    : "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                manager     : 1,
                roles       : [1]
            }

            apiHandler.post("/api/user/creation/post", {headers: headers, body: bodyFail}, (value) => {
                expect(value["data"]["success"]).toBe("false");
            });
        });

        test("Fail case", () => {
            let bodyFail = {
                firstName   : "Test",
                lastName    : "Test",
                manager     : 2,
                roles       : [1]
            }

            apiHandler.post("/api/user/creation/post", {headers: headers, body: bodyFail}, (value) => {
                expect(value["data"]["success"]).toBe("false");
            });
        });
    });

    describe("User PUT API", () => {
       test("Fail case", () => {
           let bodyFail = {
               firstName   : "Test",
               lastName    : "Fail",
               email       : "fail@test.com",
           };

           apiHandler.put("/api/user/edit/put", {headers: headers, body: bodyFail}, (value) => {
               expect(value["data"]["success"]).toBe("false");
           });
       });

        test("Success case", () => {
            let bodyFail = {
                userId      : 13,
                firstName   : "UserPut",
                lastName    : "Edited",
                email       : "edited@test.com",
            };

            apiHandler.put("/api/user/edit/put", {headers: headers, body: bodyFail}, (value) => {
                expect(value["data"]["success"]).toMatch("true");
            });
        });
    });
});