import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {authKey} from "../testBaseConfig";
const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");

describe("Role API", () =>  {
    describe("GET API", () => {
        // Try to get a role without an id
        test("Fail case", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/role/get", {authKey: authKey}, (value) => {
                    expect(value["message"]).toMatch("Bad Request");
                    resolve(true);
                });
            });
        });

        // Try to get a role with an id
        test("Success case 1 id", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/role/get?ids=2", {authKey: authKey}, (value) => {
                    expect(value).toStrictEqual({
                        "status": 200,
                        "data": [
                            {"id": 2, "name": "manager"}
                        ]
                    });
                    resolve(true);
                });
            });
        });

        // Try to get a role with multiple ids
        test("Success case multiple ids", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/role/get?ids=2,3,4", {authKey: authKey}, (value) => {
                    expect(value).toStrictEqual({
                        "status": 200,
                        "data": [
                            {"id": 2, "name": "manager"},
                            {"id": 3, "name": "project-leader"},
                            {"id": 4, "name": "admin"}
                        ]
                    });
                });
                resolve(true);
            });
        });

        // Try to get all role
        test("Success case multiple ids", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/role/get?ids=*", {authKey: authKey}, (value) => {
                    expect(value).toStrictEqual({
                        "status": 200,
                        "data": [
                            {"id": 1, "name": "normal"},
                            {"id": 2, "name": "manager"},
                            {"id": 3, "name": "project-leader"},
                            {"id": 4, "name": "admin"}
                        ]
                    });
                    resolve(true);
                });
            });
        });
    });
});