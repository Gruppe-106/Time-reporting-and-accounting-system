import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {getConfig} from "../testBaseConfig";

const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = getConfig();

describe("Group API", () => {
    describe("GET API", () => {
        test("User fail case", () => {
            apiHandler.get("/api/group/manager/get", { headers: headers }, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        test("Success GET message manager", async () => {
            await apiHandler.get("/api/group/manager/get?manager=3", { headers: headers }, (value) => {
                expect(value["status"]).toEqual(200);
                expect(value).toStrictEqual({
                    status: 200,
                    data: [
                        {
                            managerId: 3,
                            firstName: 'Group',
                            lastName: 'Manager',
                            groupId: 2,
                            employees: [
                                { "id": 4, "firstName": "Group", "lastName": "User1", "email": "groupget1@example.com" },
                                { "id": 5, "firstName": "Group", "lastName": "User2", "email": "groupget2@example.com" }
                            ]
                        }
                    ]
                },);
            });
        });

        test("Success GET message group", () => {
            apiHandler.get("/api/group/manager/get?group=2", { headers: headers }, (value) => {
                expect(value["status"]).toEqual(200);
                expect(value).toStrictEqual({
                    status: 200,
                    data: [
                        {
                            managerId: 3,
                            firstName: 'Group',
                            lastName: 'Manager',
                            groupId: 2,
                            employees: [
                                { "id": 4, "firstName": "Group", "lastName": "User1", "email": "groupget1@example.com" },
                                { "id": 5, "firstName": "Group", "lastName": "User2", "email": "groupget2@example.com" }
                            ]
                        }
                    ]
                });
            });
        });
    });

    describe("POST API", () => {
        test("Fail case", () => {
            apiHandler.post("/api/group/creation/post", { headers: headers }, (value) => {
                expect(value["status"]).toBe(404);
                expect(value["data"]["success"]).toMatch("false");
                expect(value["data"]["message"]).toMatch("Missing Body");
            });
        });

        test("Success case", () => {
            apiHandler.post("/api/group/creation/post", { headers: headers, body: { managerId: 6 } }, (value) => {
                expect(value["data"]["success"]).toMatch("true");
                expect(value["status"]).toBe(200);
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
            apiHandler.put("/api/group/edit/put", { headers: headers, body: [{ managerId: 7, groupId: 1 }] }, (value) => {
                expect(value["data"]["success"]).toMatch("true");
            })
        });
    });
});