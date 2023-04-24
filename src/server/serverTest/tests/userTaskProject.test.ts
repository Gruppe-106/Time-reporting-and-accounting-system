import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {getConfig} from "../testBaseConfig";

const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = getConfig();

describe("User Task Project API", () => {
    describe("GET API", () => {
        test("User fail case", () => {
            apiHandler.get("/api/user/task/project/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        });

        test("Success GET message", async () => {
            apiHandler.get("/api/user/task/project/get?user=16", {headers: headers}, (value) => {
                expect(value["status"]).toBe(200);
                expect(value).toStrictEqual({
                    status: 200,
                    data: [
                        {
                            taskName: 'Task Put Task 1',
                            taskId: 5,
                            projectId: 7,
                            projectName: 'Project Task Put 1'
                        },
                        {
                            taskName: 'Task Put Task 2',
                            taskId: 6,
                            projectId: 8,
                            projectName: 'Project Task Put 2'
                        }
                    ]
                });
            });
        });
    })
})