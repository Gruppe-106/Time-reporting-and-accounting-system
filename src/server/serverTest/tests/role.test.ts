import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {getConfig} from "../testBaseConfig";

const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = getConfig();

describe("Role API", () =>  {
    describe("GET API", () => {
        // Try to get a role without an id
        test("Fail case", async () => {
            await apiHandler.get("/api/role/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        // Try to get a role with an id
        test("Success case 1 id", async () => {
            await apiHandler.get("/api/role/get?ids=2", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [
                        {"id": 2, "name": "manager"}
                    ]
                });
            });
        });

        // Try to get a role with multiple ids
        test("Success case multiple ids", async () => {
            await apiHandler.get("/api/role/get?ids=2,3,4", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [
                        {"id": 2, "name": "manager"},
                        {"id": 3, "name": "project-leader"},
                        {"id": 4, "name": "admin"}
                    ]
                });
            });
        });

        // Try to get all role
        test("Success case multiple ids", async () => {
            await apiHandler.get("/api/role/get?ids=*", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [
                        {"id": 1, "name": "normal"},
                        {"id": 2, "name": "manager"},
                        {"id": 3, "name": "project-leader"},
                        {"id": 4, "name": "admin"}
                    ]
                });
            });
        });
    });
});