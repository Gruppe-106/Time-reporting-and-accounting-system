import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {authKey} from "../testBaseConfig";
const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");

describe("Group API", () => {
    describe("GET API", () => {
        test("User fail case", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/group/manager/get", { authKey: authKey }, (value) => {
                    expect(value["message"]).toMatch("Bad Request");
                    resolve(true);
                });
            });
        });

        test("Success GET message manager", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/group/manager/get?manager=3", { authKey: authKey }, (value) => {
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
                    resolve(true);
                });
            });
        });

        test("Success GET message group", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/group/manager/get?group=2", {authKey: authKey}, (value) => {
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
                                    {
                                        "id": 4,
                                        "firstName": "Group",
                                        "lastName": "User1",
                                        "email": "groupget1@example.com"
                                    },
                                    {
                                        "id": 5,
                                        "firstName": "Group",
                                        "lastName": "User2",
                                        "email": "groupget2@example.com"
                                    }
                                ]
                            }
                        ]
                    });
                    resolve(true);
                });
            });
        });
    });

    describe("POST API", () => {
        test("Fail case", async () => {
            await new Promise((resolve) => {
                apiHandler.post("/api/group/creation/post", { authKey: authKey }, (value) => {
                    expect(value["status"]).toBe(404);
                    expect(value["data"]["success"]).toMatch("false");
                    expect(value["data"]["message"]).toMatch("Missing Body");
                    resolve(true);
                });
            })
        });

        test("Success case", async () => {
            await new Promise((resolve) => {
                apiHandler.post("/api/group/creation/post", { authKey: authKey, body: { managerId: 6 } }, (value) => {
                    expect(value["data"]["success"]).toMatch("true");
                    expect(value["status"]).toBe(200);
                    resolve(true);
                });
            });
        });
    });

    describe("PUT API", () => {
        test("Fail case", async () => {
            await new Promise((resolve) => {
                apiHandler.put("/api/group/edit/put", { authKey: authKey }, (value) => {
                expect(value["status"]).toBe(404);
                expect(value["data"]["success"]).toMatch("false");
                expect(value["data"]["message"]).toMatch("Missing Body");
                resolve(true);
            })});
        });

        test("Success case", async () => {
            await new Promise((resolve) => {
                apiHandler.put("/api/group/edit/put", { authKey: authKey, body: [{ managerId: 7, groupId: 1 }] }, (value) => {
                    expect(value["data"]["success"]).toMatch("true");
                    resolve(true);
            })});
        });
    });
});