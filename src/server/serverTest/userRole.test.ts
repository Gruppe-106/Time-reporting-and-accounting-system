import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

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
            await apiHandler.get("/api/role/user/get?user=2", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [{"userId": 2, "roleId": 2, "firstName": "Joe", "lastName": "Smith", "name": "manager"}]
                });
            });
        });

        // Try to get a role with multiple ids
        test("Success case user multiple ids", async () => {
            await apiHandler.get("/api/role/user/get?user=2,3,4", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [{
                        "userId": 2,
                        "roleId": 2,
                        "firstName": "Joe",
                        "lastName": "Smith",
                        "name": "manager"
                    }, {
                        "userId": 3,
                        "roleId": 2,
                        "firstName": "Jane",
                        "lastName": "Doe",
                        "name": "manager"
                    }, {
                        "userId": 4,
                        "roleId": 2,
                        "firstName": "Tom",
                        "lastName": "Jones",
                        "name": "manager"
                    }]
                });
            });
        });

        //
        test("Success case role", async () => {
            await apiHandler.get("/api/role/user/get?role=2", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [{
                        "userId": 2,
                        "roleId": 2,
                        "firstName": "Joe",
                        "lastName": "Smith",
                        "name": "manager"
                    }, {
                        "userId": 3,
                        "roleId": 2,
                        "firstName": "Jane",
                        "lastName": "Doe",
                        "name": "manager"
                    }, {
                        "userId": 4,
                        "roleId": 2,
                        "firstName": "Tom",
                        "lastName": "Jones",
                        "name": "manager"
                    }]
                });
            });
        });
    });
});