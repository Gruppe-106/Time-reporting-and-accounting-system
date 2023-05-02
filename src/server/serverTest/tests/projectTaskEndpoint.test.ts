import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {getConfig} from "../testBaseConfig";

const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = getConfig();

describe("project/task API", () => {
    // Try to get a project/task without an id
    test("Fail case", () => {
        apiHandler.get("/api/task/project/get", {headers: headers}, (value) => {
            expect(value["message"]).toMatch("Bad Request");
        });
    });

    test("Success Task", () => {
        apiHandler.get("/api/task/project/get?task=1", {headers: headers}, (value) => {
            expect(value).toStrictEqual({
                "status": 200,
                "data": [
                    {"taskId": 1, "projectId": 3, "taskName": "Project Info Task", "projectName": "Project Info Test"}
                ]
            });
        });
    });

    test("Success Project", () => {
        apiHandler.get("/api/task/project/get?project=3", {headers: headers}, (value) => {
            expect(value).toStrictEqual({
                "status": 200,
                "data": [
                    {"taskId": 1, "projectId": 3, "taskName": "Project Info Task", "projectName": "Project Info Test"}
                ]
            });
        });
    });
});