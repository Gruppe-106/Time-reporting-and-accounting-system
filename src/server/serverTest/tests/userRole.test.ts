import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {getConfig} from "../testBaseConfig";

const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = getConfig();

describe("User Role API", () => {
    describe("GET API", () => {
        // Try to get a role without an id
        test("Fail case", async () => {
            await apiHandler.get("/api/role/user/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        // Try to get a role with an id
        test("Success case user one id", async () => {
            await apiHandler.get("/api/role/user/get?user=7", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [{"userId": 7, "roleId": 2, "firstName": "Group", "lastName": "Manager", "name": "manager"}]
                });
            });
        });

        // Try to get a role with multiple ids
        test("Success case user multiple ids", async () => {
            await apiHandler.get("/api/role/user/get?user=6,7", {headers: headers}, (value) => {
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
            });
        });

        //
        test("Success case role", async () => {
            await apiHandler.get("/api/role/user/get?role=3", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual( {
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
                },);
            });
        });
    });
});