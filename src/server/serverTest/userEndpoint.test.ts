import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

describe("User API", () => {
    describe("User GET API", () => {
        test("User fail case", () => {
            apiHandler.get("/api/user/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });
    });
});