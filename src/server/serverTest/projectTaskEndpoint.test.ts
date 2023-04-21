import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler= new BaseApiHandler("http://localhost:8080");


describe("project/task API", () => {
    // Try to get a project/task without an id
    test("Fail case", () => {
        apiHandler.get("/api/task/project/get", {headers: headers}, (value) => {
            expect(value["message"]).toMatch("Bad Request");
        });
    });

    // Try to get a project/task without an id
    test("Success case", () => {
        apiHandler.get("/api/task/project/get?task=3", {headers: headers}, (value) => {
            expect(value).toStrictEqual({
                "status": 200,
                "data": [
                    {"taskId": 3, "projectId": 3, "taskName": "Task Z", "projectName": "Project Gamma"}
                ]
            });
        });
    });
});