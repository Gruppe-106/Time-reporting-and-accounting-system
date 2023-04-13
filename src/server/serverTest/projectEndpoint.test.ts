import BaseApiHandler from "../../client/src/network/baseApiHandler";

const apiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = {};
headers["cookie"] = "auth=h1i2j3k4";

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
test("Testing project get api", async () => {
    // Try to get a project without an id
    apiHandler.get("/api/project/get", {headers: headers}, (value) => {
        expect(value["message"]).toMatch("Bad Request");
    });

    // Try getting project with id 1
    apiHandler.get("/api/project/get?ids=1", {headers: headers}, (value) => {
        let data: ProjectGetData = JSON.parse(JSON.stringify(value));
        let project = data.data.pop();
        expect(project.id).toBe(1);
        expect(project.superProjectId).toBe(0);
        expect(project.name).toMatch('Project Alpha');
        expect(project.startDate).toBe(1679266800000);
        expect(project.endDate).toBe(1679439600000);
    });

    // Try getting project 1 but only specified values
    apiHandler.get("/api/project/get?ids=1&var=name,startDate", {headers: headers}, (value) => {
        let data: ProjectGetData = JSON.parse(JSON.stringify(value));
        let project = data.data.pop();
        expect(project.id).toBeUndefined();
        expect(project.superProjectId).toBeUndefined();
        expect(project.name).toMatch('Project Alpha');
        expect(project.startDate).toBe(1679266800000);
        expect(project.endDate).toBeUndefined();
    });
})

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

test("Testing project creation api", async () => {
    // Try to send with no body
    apiHandler.post("/api/project/creation/post", {headers: headers}, (value) => {
        expect(value["status"]).toBe(404);
        expect(value["data"]["message"]).toMatch("Missing Body");
        expect(value["data"]["success"]).toMatch("false");
    });

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

test("Testing project edit api", async () => {
    // Try to update project with missing body
    apiHandler.put("/api/project/edit/put", {headers: headers}, (value) => {
        expect(value["status"]).toBe(404);
        expect(value["data"]["message"]).toMatch("Missing Body");
        expect(value["data"]["success"]).toMatch("false");
    })


})