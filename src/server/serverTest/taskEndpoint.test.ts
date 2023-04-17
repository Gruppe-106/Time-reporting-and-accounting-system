import BaseApiHandler from "../../client/src/network/baseApiHandler";
import {headers} from "./testBaseConfig";
import TaskCreationEndpoint, {TaskCreationData, TaskData} from "../apiEndpoints/dataPostEndpoints/taskCreationEndpoint";
import {TaskEditData} from "../apiEndpoints/dataPutEndpoints/taskEditEndpoint";

const apiHandler = new BaseApiHandler("http://localhost:8080");

test("Testing task get api", async () => {
    // Fail get message
    apiHandler.get("/api/task/get", {headers: headers}, (value) => {
        expect(value["message"]).toMatch("Bad Request");
    })

    // Success get message
    apiHandler.get("/api/task/get?ids=1", {headers: headers}, (value) => {
        expect(value).toStrictEqual({
            "status":200,
            "data": [
                {"name":"Task X","id":1,"startDate":1679266800000,"endDate":1682460000000,"timeType":1}
            ]
        });
    });

    apiHandler.get("/api/task/get?ids=1,3,5", {headers: headers}, (value) => {
        expect(value).toStrictEqual({
            "status":200,
            "data": [
                {"name":"Task X","id":1,"startDate":1679266800000,"endDate":1682460000000,"timeType":1},
                {"name":"Task Z","id":3,"startDate":1679266800000,"endDate":1682460000000,"timeType":1},
                {"name":"Task B","id":5,"startDate":1679526000000,"endDate":1685052000000,"timeType":1}
            ]
        });
    })
});

test("Testing task creation api", async () => {
    let bodySuccess: TaskCreationData = {
        projectId: 1,
        task: {
            name: "Task test",
            userId: [1,2,3],
            startDate: 1679266800000,
            endDate: 1682460000000,
            timeType: 1
        }
    }

    apiHandler.post("/api/task/creation/post", {headers: headers, body: bodySuccess}, (value) => {
        expect(value["data"]["success"]).toMatch("true");
    });

    let bodyFail = {
        projectId: 1,
    }

    apiHandler.post("/api/task/creation/post", {headers: headers, body: bodyFail}, (value) => {
        expect(value["status"]).toBe(404);
    })
});

test("Testing task edit api", async () => {
    let bodySuccess: TaskEditData = {
        taskId: 1,
        name: "Task Edited task"
    }
    apiHandler.put("/api/task/edit/put", {headers: headers, body: bodySuccess}, (value) => {
        expect(value["data"]["success"]).toMatch("true");
    });

    let bodyFail = {
        name: "Task Edited task"
    }
    apiHandler.put("/api/task/edit/put", {headers: headers, body: bodyFail}, (value) => {
        expect(value["status"]).toBe(404);
    });
});
