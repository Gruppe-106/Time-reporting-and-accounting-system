import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

describe("Auth API", () => {
   describe("POST API", () => {
      test("Auth Fail", () => {
         apiHandler.post("/api/auth", {}, (value) => {
            expect(value["status"]).toBe(404);
            expect(value["data"]["success"]).toMatch("false");
         });
      });

      test("Auth Success", () => {
         apiHandler.post("/api/auth", {headers: headers}, (value) => {
            expect(value["status"]).toBe(200);
            expect(value["data"]["success"]).toMatch("true");
         });
      });
   });
});