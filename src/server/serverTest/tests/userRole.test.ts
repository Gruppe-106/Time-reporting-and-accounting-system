import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {authKey} from "../testBaseConfig";
const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");

describe("User Role API", () => {
    describe("GET API", () => {
        // Try to get a role without an id
        test("Fail case", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/role/user/get", {authKey: authKey}, (value) => {
                    expect(value["message"]).toMatch("Bad Request");
                    resolve(true);
                });
            });
        });

        // Try to get a role with an id
        test("Success case user one id", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/role/user/get?user=7", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value).toStrictEqual({
                        "status": 200,
                        "data": [{
                            "userId": 7,
                            "roleId": 2,
                            "firstName": "Group",
                            "lastName": "Manager",
                            "name": "manager"
                        }]
                    });
                    resolve(true);
                });
            });
        });

        // Try to get a role with multiple ids
        test("Success case user multiple ids", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/role/user/get?user=6,7", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value).toStrictEqual({
                        status: 200,
                        data: [
                            {
                                userId: 6,
                                roleId: 2,
                                firstName: 'Group',
                                lastName: 'Manager',
                                name: 'manager'
                            },
                            {
                                userId: 7,
                                roleId: 2,
                                firstName: 'Group',
                                lastName: 'Manager',
                                name: 'manager'
                            }
                        ]
                    });
                    resolve(true);
                });
            });
        });

        test("Success case role", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/role/user/get?role=3", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value).toStrictEqual({
                        status: 200,
                        data: [
                            {
                                userId: 14,
                                roleId: 3,
                                firstName: 'User',
                                lastName: 'Role1',
                                name: 'project-leader'
                            },
                            {
                                userId: 15,
                                roleId: 3,
                                firstName: 'User',
                                lastName: 'Role2',
                                name: 'project-leader'
                            }
                        ]
                    });
                    resolve(true);
                });
            });
        });
    });
});