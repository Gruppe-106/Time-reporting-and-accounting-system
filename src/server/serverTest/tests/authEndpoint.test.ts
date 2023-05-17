import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {authKey} from "../testBaseConfig";
const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");

describe("Auth API", () => {
   describe("POST API", () => {
      test("Auth Fail", async () => {
         await new Promise((resolve) => {
            apiHandler.get("/api/auth", {}, (value) => {
               expect(value["status"]).toBe(404);
               expect(value["data"]["success"]).toBe(false);
               resolve(true);
            });
         });
      });

      test("Auth Success", async () => {
         await new Promise((resolve) => {
            apiHandler.get("/api/auth", { authKey: authKey }, (value) => {
               expect(value["status"]).toBe(200);
               expect(value["data"]["success"]).toBe(true);
               resolve(true);
            });
         });
      });

      test("Auth Fail Expired", async () => {
         await new Promise((resolve) => {
            let expiredAuth = "2481f36dfc515ca76451aaadf1399026942a01ee50c6d0a61988b43cef039bc2";
            apiHandler.get("/api/auth", { authKey: expiredAuth }, (value) => {
               expect(value["status"]).toBe(404);
               expect(value["data"]["success"]).toBe(false);
               resolve(true);
            });
         });
      });
   });
});