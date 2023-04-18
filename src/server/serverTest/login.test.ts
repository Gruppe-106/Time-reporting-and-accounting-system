import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

describe("Login API", () => {
    describe("POST API", () => {
        test("Fail case, no body", () => {
           apiHandler.post("/api/login", {}, (value) => {
               expect(value["status"]).toBe(404);
               expect(value["data"]["message"]).toMatch("Missing Body");
               expect(value["data"]["success"]).toMatch("false");
           })
        });

        test("Fail case, bad password", () => {
            let bodyFail = {
                email: "dave@example.com",
                password: "4f31fa50e5bd5ff45684e560fc24aeee527a43739ab611c49c51098a33e2b469"
            }
            apiHandler.post("/api/login", {body: bodyFail}, (value) => {
               expect(value).toStrictEqual({"status":404,"data":{"success":false}});
            });
        });

        test("Success case", () => {
            let bodySuccess = {
                email: "matt@example.com",
                password: "4f31fa50e5bd5ff45684e560fc24aeee527a43739ab611c49c51098a33e2b469"
            }

            apiHandler.post("/api/login", {body: bodySuccess}, (value) => {
                expect(value["data"]["message"][0]).toMatch("success");
                expect(parseInt(value["data"]["message"][2])).toBeGreaterThan(Date.now());
            })
        });
    });
});