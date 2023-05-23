import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {authKey} from "../testBaseConfig";
const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");

describe("Time-type API", () => {
    describe("GET API", () => {
        // Try to get a role without an id
        test("Fail case", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/timetype/get", {authKey: authKey}, (value) => {
                    expect(value["message"]).toMatch("Bad Request");
                    resolve(true);
                });
            });
        });

        // Try to get a role with an id
        test("Success case time-type one id", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/timetype/get?ids=2", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value).toStrictEqual({
                        "status": 200,
                        "data": [
                            {"id": 2, "name": "non-billable"}
                        ]
                    });
                    resolve(true);
                });
            });
        });

        // Try to get a role with *
        test("Success case time-type all", async () => {
            await new Promise((resolve) => {
                apiHandler.get("/api/timetype/get?ids=*", {authKey: authKey}, (value) => {
                    expect(value["status"]).toBe(200);
                    expect(value).toStrictEqual({
                        "status": 200,
                        "data": [
                            {"id": 1, "name": "billable"},
                            {"id": 2, "name": "non-billable"},
                            {"id": 3, "name": "sick"},
                            {"id": 4, "name": "vacation"}
                        ]
                    });
                    resolve(true);
                });
            });
        });
    });
});