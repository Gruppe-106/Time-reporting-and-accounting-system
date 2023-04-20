import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

describe("User API", () => {
    describe("User GET API", () => {
        test("User fail case", () => {
            apiHandler.get("/api/user/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        test("Success get message with single ID", async () => {
            apiHandler.get("/api/user/get?ids=1", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    "status":200,
                    "data": [
                        {id: 1, email: 'matt@example.com', firstName: 'Matt', lastName: 'Brown', groupId: 2}
                    ]
                });
            });
        });

        test("Success get message with multiple IDs", async () => {
            apiHandler.get("/api/user/get?ids=1,3", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    "status":200,
                    "data": [
                        {id: 1, email: 'matt@example.com', firstName: 'Matt', lastName: 'Brown', groupId: 2},
                        {id: 3, email: 'jane@example.com', firstName: 'Jane', lastName: 'Doe', groupId: 4}
                    ]
                });
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
                manager     : 2,
                roles       : [1]
            }

            apiHandler.post("/api/user/creation/post", {headers: headers, body: bodySuccess}, (value) => {
                expect(value["data"]["success"]).toMatch("true");
            });
        })

        test("Fail case bad email", () => {
            let bodyFail = {
                firstName   : "Test",
                lastName    : "Test",
                email       : "testtest.com",
                password    : "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                manager     : 2,
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
        })
    })

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
                userId      : 5,
                firstName   : "Test",
                lastName    : "Fail",
                email       : "fail@test.com",
            };

            apiHandler.put("/api/user/edit/put", {headers: headers, body: bodyFail}, (value) => {
                expect(value["data"]["success"]).toMatch("true");
            });
        });
    });
});