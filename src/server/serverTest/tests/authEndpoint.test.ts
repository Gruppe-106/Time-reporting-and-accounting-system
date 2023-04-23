import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {getConfig} from "../testBaseConfig";

const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = getConfig();

describe("Auth API", () => {
   describe("POST API", () => {
      test("Auth Fail", () => {
         apiHandler.get("/api/auth", {}, (value) => {
            expect(value["status"]).toBe(404);
            expect(value["data"]["success"]).toBe(false);
         });
      });

      test("Auth Success", () => {
         apiHandler.get("/api/auth", {headers: headers}, (value) => {
            expect(value["status"]).toBe(200);
            expect(value["data"]["success"]).toBe(true);
         });
      });

      test("Auth Fail Expired", () => {
         let expiredHeaders: Record<string, string> = {};
         expiredHeaders["cookie"] = "auth=2481f36dfc515ca76451aaadf1399026942a01ee50c6d0a61988b43cef039bc2";
         apiHandler.get("/api/auth", {headers: expiredHeaders}, (value) => {
            expect(value["status"]).toBe(404);
            expect(value["data"]["success"]).toBe(false);
         });
      });
   });
});