import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

describe("Group API", () => {
    describe("GET API", () => {
        test("User fail case", () => {
            apiHandler.get("/api/group/manager/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        test("Success GET message manager", async () => {
            apiHandler.get("/api/group/manager/get?manager=2", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    "status": 200,
                    "data":
                        [
                            {
                                "managerId": 2, "firstName": "Joe", "lastName": "Smith", "groupId": 2, "employees": [
                                    {"id": 1, "firstName": "Matt", "lastName": "Brown", "email": "matt@example.com"},
                                    {"id": 4, "firstName": "Tom", "lastName": "Jones", "email": "tom@example.com"},
                                    {"id": 8, "firstName": "Sarah", "lastName": "Doe", "email": "sarah@example.com"}
                                ]
                            }
                        ]
                });
            });
        });
        test("Success GET message group", async () => {
            apiHandler.get("/api/group/manager/get?group=2", {headers: headers}, (value) => {
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
                        }, {"id": 4, "firstName": "Tom", "lastName": "Jones", "email": "tom@example.com"}, {
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
           apiHandler.post("/api/group/manager/post", {headers: headers}, (value) => {
               expect(value["message"]).toMatch("Bad Request");
           });
        });

        test("Success case", () => {
            apiHandler.post("/api/group/manager/post", {headers: headers, body: {managerId: 3}}, (value) => {
                expect(value["success"]).toMatch("true");
            });
        });
    });

    describe("PUT API", () => {
        test("Fail case", () => {
            apiHandler.post("/api/group/edit/put", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        test("Success case", () => {
            apiHandler.post("/api/group/edit/put", {headers: headers, body: {managerId: 3, groupId: 2}}, (value) => {
                expect(value["success"]).toMatch("true");
            })
        });
    });
});