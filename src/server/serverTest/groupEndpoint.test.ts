import BaseApiHandler from "../../client/src/network/baseApiHandler";
import { headers } from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

describe("Group API", () => {
    describe("GET API", () => {
        test("User fail case", () => {
            apiHandler.get("/api/group/manager/get", { headers: headers }, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        test("Success GET message manager", async () => {
            await apiHandler.get("/api/group/manager/get?manager=2", { headers: headers }, (value) => {
                expect(value["status"]).toEqual(200);
                expect(value).toStrictEqual({
                    "status": 200,
                    "data":
                        [
                            {
                                "managerId": 2, "firstName": "Joe", "lastName": "Smith", "groupId": 2, "employees": [
                                    { "id": 1, "firstName": "Matt", "lastName": "Brown", "email": "matt@example.com" },
                                    { "id": 4, "firstName": "Tom", "lastName": "Jones", "email": "tom@example.com" },
                                    { "id": 8, "firstName": "Sarah", "lastName": "Doe", "email": "sarah@example.com" }
                                ]
                            }
                        ]
                });
            });
        });

        test("Success GET message group", () => {
            apiHandler.get("/api/group/manager/get?group=2", { headers: headers }, (value) => {
                expect(value["status"]).toEqual(200);
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [{
                        "managerId": 2,
                        "firstName": "Joe",
                        "lastName": "Smith",
                        "groupId": 2,
                        "employees": [{
                            "id": 1,
                            "firstName": "Matt",
                            "lastName": "Brown",
                            "email": "matt@example.com"
                        }, { "id": 4, "firstName": "Tom", "lastName": "Jones", "email": "tom@example.com" }, {
                            "id": 8,
                            "firstName": "Sarah",
                            "lastName": "Doe",
                            "email": "sarah@example.com"
                        }]
                    }]
                });
            });
        });
    });
    describe("POST API", () => {
        test("Fail case", () => {
            apiHandler.post("/api/group/creation/post", { headers: headers }, (value) => {
                console.log(value["data"]["success"])
                expect(value["status"]).toBe(404);
                expect(value["data"]["success"]).toMatch("false");
                expect(value["data"]["message"]).toMatch("Missing Body");
            });
        });

        test("Success case", () => {
            apiHandler.post("/api/group/creation/post", { headers: headers, body: { managerId: 3 } }, (value) => {
                expect(value["data"]["success"]).toMatch("false");
            });
        });
    });

    describe("PUT API", () => {
        test("Fail case", () => {
            apiHandler.put("/api/group/edit/put", { headers: headers }, (value) => {
                expect(value["status"]).toBe(404);
                expect(value["data"]["success"]).toMatch("false");
                expect(value["data"]["message"]).toMatch("Missing Body");
            });
        });

        test("Success case", () => {
            apiHandler.put("/api/group/edit/put", { headers: headers, body: [{ managerId: 1, groupId: 3 }] }, (value) => {
                expect(value["data"]["success"]).toMatch("true");
            })
        });
    });

});