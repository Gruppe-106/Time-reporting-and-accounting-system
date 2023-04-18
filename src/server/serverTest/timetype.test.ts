import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

describe("Time-type API", () => {
    describe("GET API", () => {
        // Try to get a role without an id
        test("Fail case", async () => {
            await apiHandler.get("/api/timetype/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        // Try to get a role with an id
        test("Success case time-type one id", async () => {
            await apiHandler.get("/api/timetype/get?ids=2", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [
                        {"id":2,"name":"sick"}
                    ]
                });
            });
        });

        // Try to get a role with *
        test("Success case time-type all", async () => {
            await apiHandler.get("/api/timetype/get?ids=*", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual({
                    "status": 200,
                    "data": [
                        {"id":0,"name":"billable"},
                        {"id":1,"name":"non-billable"},
                        {"id":2,"name":"sick"},
                        {"id":3,"name":"vacation"}
                    ]
                });
            });
        });
    });
});