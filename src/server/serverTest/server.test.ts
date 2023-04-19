import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

describe("Testing base api routes", () => {
  const testCases = [
    { method: "get", message: "Api GET gotten" },
    { method: "post", message: "Api POST gotten" },
    { method: "put", message: "Api PUT gotten" },
    { method: "delete", message: "Api DELETE gotten" },
  ];

  testCases.forEach(({ method, message }) => {
    test(`Testing \${method.toUpperCase()} base api`, () => {
      apiHandler[method]("/api/", { headers: headers }, (value: { [x: string]: any; }) => {
        expect(value["message"]).toMatch(message);
      });
    });
  });
});
