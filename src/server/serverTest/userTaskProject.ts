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
            apiHandler.get("/api/user/task/project/get?user=6", {headers: headers}, (value) => {
                expect(value).toStrictEqual({
                    status: 200,
                    data: [
                        {
                            taskName: 'Task Z',
                            taskId: 3,
                            projectId: 3,
                            projectName: 'Project Gamma'
                        },
                        {
                            taskName: 'Task E',
                            taskId: 8,
                            projectId: 3,
                            projectName: 'Project Gamma'
                        }
                    ]
                });
            });
        });
    })
})