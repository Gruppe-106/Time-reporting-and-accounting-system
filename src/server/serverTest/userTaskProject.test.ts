import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";

const apiHandler = new BaseApiHandler("http://localhost:8080");

describe("User Task Project API", () => {
    describe("GET API", () => {
        test("User fail case", () => {
            apiHandler.get("/api/user/task/project/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        test("Success GET message", async () => {
            apiHandler.get("/api/user/task/project/get?user=11", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual({
                    status: 200,
                    data: [
                        {
                            taskName: 'Task X',
                            taskId: 1,
                            projectId: 1,
                            projectName: 'Project Alpha'
                        },
                        {
                            taskName: 'Task User Task',
                            taskId: 13,
                            projectId: 7,
                            projectName: 'Project User Task'
                        }
                    ]
                });
            });
        });
    })
})