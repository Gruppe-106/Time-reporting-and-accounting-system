import BaseApiHandler from "../../../client/src/network/baseApiHandler";
import {getConfig} from "../testBaseConfig";

const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = getConfig();

import {ProjectEditData} from "../../apiEndpoints/dataPutEndpoints/projectEditEndpoint";


interface PostReturnMessage {
    status: number,
    data: {
        success? : boolean,
        error?   : string,
        message? : string[],
        reason?  : string[]
    }
}

interface ProjectGetData {
    status: number,
    data:
        {
            id?           : number,
            superProjectId? : number,
            name?         : string,
            startDate?    : number,
            endDate?      : number,
            projectLeader : {
                id        : number,
                lastName  : string,
                firstName : string
            }
        }[]
}

interface ProjectCreateBody {
    superProjectId?: number,
    name           : string,
    startDate      : number,
    endDate        : number,
    projectLeader  : number[],
    task?: {
        name       : string,
        userId     : number[],
        startDate  : number,
        endDate    : number,
        timeType   : number
    }[]
}


describe("Project API", () => {
    describe("GET API", () => {
        // Try to get a project without an id
        test("Fail case", () => {
            apiHandler.get("/api/project/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        })

        // Try getting project with id 1
        test("Success case 1 id", () => {
            apiHandler.get("/api/project/get?ids=1", {headers: headers}, (value) => {
                let data: ProjectGetData = JSON.parse(JSON.stringify(value));
                expect(data.status).toBe(200);

                let project = data.data.pop();
                expect(project.id).toBe(1);
                expect(project.superProjectId).toBe(0);
                expect(project.name).toMatch('Project Get Test');
                expect(project.startDate).toBe(1679266800000); // 2023-03-20 00:00:00
                expect(project.endDate).toBe(1682114400000);   // 2023-04-22 00:00:00
            });
        });

        // Try getting project with id 1
        test("Success case all", () => {
            apiHandler.get("/api/project/get?ids=*", {headers: headers}, (value) => {
                let data: ProjectGetData = JSON.parse(JSON.stringify(value));
                expect(data.status).toBe(200);
                expect(data.data.length).toBeGreaterThanOrEqual(1);
            });
        });

        // Try getting project 1 but only specified values
        test("Success case specific variables", () => {
            apiHandler.get("/api/project/get?ids=1&var=name,startDate", {headers: headers}, (value) => {
                let data: ProjectGetData = JSON.parse(JSON.stringify(value));
                expect(data.status).toBe(200);

                let project = data.data.pop();
                expect(project.id).toBeUndefined();
                expect(project.superProjectId).toBeUndefined();
                expect(project.name).toMatch('Project Get Test');
                expect(project.startDate).toBe(1679266800000); // 2023-03-20 00:00:00
                expect(project.endDate).toBeUndefined();
            });
        });
    })

    describe("POST api", () => {
        // Try to send with no body
        test("Fail case", () => {
            apiHandler.post("/api/project/creation/post", {headers: headers}, (value) => {
                expect(value["status"]).toBe(404);
                expect(value["data"]["message"]).toMatch("Missing Body");
                expect(value["data"]["success"]).toMatch("false");
            });
        })
        // Try to send with the required properties
        let bodySuccess: ProjectCreateBody = {
            name: "test",
            startDate: 1735689600000, //2025-01-01
            endDate: 1764547200000,   //2025-12-01
            projectLeader: [2]
        }
        apiHandler.post("/api/project/creation/post", {headers: headers, body: bodySuccess}, (value) => {
            let data: PostReturnMessage = JSON.parse(JSON.stringify(value));
            expect(data.status).toBe(200);
            expect(data.data.message[0]).toBe("success");
            expect(data.data.success).toMatch("true");
        });

        // Try to send with a missing required property
        let bodyFail = {
            startDate: 1735689600000, //2025-01-01
            endDate: 1764547200000,   //2025-12-01
            projectLeader: [2]
        }
        apiHandler.post("/api/project/creation/post", {headers: headers, body: bodyFail}, (value) => {
            let data: PostReturnMessage = JSON.parse(JSON.stringify(value));
            expect(data.status).toBe(404);
        });
    })

    describe("PUT api", () => {
        // Try to update project with missing body
        test("Fail case", () => {
            apiHandler.put("/api/project/edit/put", {headers: headers}, (value) => {
                expect(value["status"]).toBe(404);
                expect(value["data"]["message"]).toMatch("Missing Body");
                expect(value["data"]["success"]).toMatch("false");
            });
        })

        test("Success case", () => {
            let bodySuccess: ProjectEditData = {
                projectId: 2,
                superProjectId: 1,
                name: "Project Put Test Edited",
                startDate: 1684706400000,
                endDate: 1687384800000,
                projectLeader: 9,
                taskAdd: [2, 10],
                taskRemove: [1, 6]
            }

            apiHandler.put("/api/project/edit/put", {headers: headers, body: bodySuccess}, (value) => {
                let data: PostReturnMessage = JSON.parse(JSON.stringify(value));
                expect(data.data.success).toMatch("true");
            });
        });

        test("Fail case missing required", () => {
            let bodyFail = {
                superProjectId: 3
            }

            apiHandler.put("/api/project/edit/put", {headers: headers, body: bodyFail}, (value) => {
                let data: PostReturnMessage = JSON.parse(JSON.stringify(value));
                expect(data.data.success).toMatch("false");
            });
        });
    });

    describe("Information api", () => {
        test("Success case", () => {
            apiHandler.get("/api/project/info/get?ids=3", {headers: headers}, (value) => {
                expect(value).toStrictEqual(
                    {
                        status: 200,
                        data: [
                            {taskId: 1, id: 4, firstName: 'Group', lastName: 'User1'},
                            {taskId: 1, id: 5, firstName: 'Group', lastName: 'User2'}
                        ]
                    }
                )
            });
        })

        test("Fail case", () => {
            apiHandler.get("/api/project/info/get", {headers: headers}, (value) => {
                expect(value["message"]).toMatch("Bad Request");
            });
        })
    });
});