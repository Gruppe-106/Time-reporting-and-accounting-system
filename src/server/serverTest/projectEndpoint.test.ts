import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";
import {ProjectEditData} from "../apiEndpoints/dataPutEndpoints/projectEditEndpoint";

const apiHandler = new BaseApiHandler("http://localhost:8080");

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
        expect(project.startDate).toBe(1679266800000); // 2023-03-20 00:00:00
        expect(project.endDate).toBe(1682114400000);   // 2023-04-22 00:00:00
    });

    // Try getting project 1 but only specified values
    apiHandler.get("/api/project/get?ids=1&var=name,startDate", {headers: headers}, (value) => {
        let data: ProjectGetData = JSON.parse(JSON.stringify(value));
        let project = data.data.pop();
        expect(project.id).toBeUndefined();
        expect(project.superProjectId).toBeUndefined();
        expect(project.name).toMatch('Project Alpha');
        expect(project.startDate).toBe(1679266800000); // 2023-03-20 00:00:00
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
    });

    let bodySuccess: ProjectEditData = {
        projectId: 1,
        superProjectId: 2,
        name: "Project test",
        startDate: 1684706400000,
        endDate: 1687384800000,
        projectLeader: 9,
        taskAdd: [2,10],
        taskRemove: [1,6]
    }

    apiHandler.put("/api/project/edit/put", {headers: headers, body: bodySuccess}, (value) => {
        let data: PostReturnMessage = JSON.parse(JSON.stringify(value));
        expect(data.data.success).toMatch("true");
    });

    let bodyFail = {
        superProjectId: 3
    }

    apiHandler.put("/api/project/edit/put", {headers: headers, body: bodyFail}, (value) => {
        let data: PostReturnMessage = JSON.parse(JSON.stringify(value));
        expect(data.data.success).toMatch("false");
    });
});

test("Testing project information api", async () => {
    apiHandler.get("/api/project/info/get?ids=5", {headers: headers}, (value) => {
        expect(value).toStrictEqual(
            {
                status: 200,
                data: [
                    { taskId: 5, id: 8, firstName: 'Sarah', lastName: 'Doe' },
                    { taskId: 5, id: 9, firstName: 'Alex', lastName: 'Johnson' },
                    { taskId: 10, id: 1, firstName: 'Matt', lastName: 'Brown' },
                    { taskId: 10, id: 2, firstName: 'Joe', lastName: 'Smith' }
                ]
            }
        )
    });

    apiHandler.get("/api/project/info/get", {headers: headers}, (value) => {
        expect(value["message"]).toMatch("Bad Request");
    });
});