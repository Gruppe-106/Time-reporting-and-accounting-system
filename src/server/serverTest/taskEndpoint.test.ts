import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";
import {TaskCreationData, TaskData} from "../apiEndpoints/dataPostEndpoints/taskCreationEndpoint";
import {TaskEditData} from "../apiEndpoints/dataPutEndpoints/taskEditEndpoint";

const apiHandler = new BaseApiHandler("http://localhost:8080");

describe("Task API", () => {
    describe("Task GET API", () => {
        test("Fail get message", async () => {
            apiHandler.get("/api/task/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        test("Success get message with single ID", async () => {
            apiHandler.get("/api/task/get?ids=1", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    "status":200,
                    "data": [
                        {"name":"Task X","id":1,"startDate":1679266800000,"endDate":1682460000000,"timeType":1}
                    ]
                });
            });
        });

        test("Success get message with multiple IDs", async () => {
            apiHandler.get("/api/task/get?ids=1,3,5", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    "status":200,
                    "data": [
                        {"name":"Task X","id":1,"startDate":1679266800000,"endDate":1682460000000,"timeType":1},
                        {"name":"Task Z","id":3,"startDate":1679266800000,"endDate":1682460000000,"timeType":1},
                        {"name":"Task B","id":5,"startDate":1679526000000,"endDate":1685052000000,"timeType":1}
                    ]
                });
            });
        });
    });

    describe("Task Creation API", () => {
        test("Success case", async () => {
            let bodySuccess: TaskCreationData = {
                projectId: 2,
                task: {
                    name: "Task test",
                    userId: [1, 2, 3],
                    startDate: 1679266800000,
                    endDate: 1682460000000,
                    timeType: 1
                }
            }

            apiHandler.post("/api/task/creation/post", {headers: headers, body: bodySuccess}, (value) => {
                expect(value["data"]["success"]).toMatch("true");
            });
        });

        test("Fail case", async () => {
            let bodyFail = {
                userId: [1,2,3],
                startDate: 1679266800000,
                endDate: 1682460000000,
                timeType: 1
            }

            apiHandler.post("/api/task/creation/post", {headers: headers, body: bodyFail}, (value) => {
                expect(value["status"]).toBe(404);
            });
        });
    });
});
