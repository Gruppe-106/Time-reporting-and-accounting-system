import BaseApiHandler from "../../client/src/network/baseApiHandler";

const apiHandler = new BaseApiHandler("http://localhost:8080");
let headers: Record<string, string> = {};
headers["cookie"] = "auth=h1i2j3k4";

// Check if all base api routes exists
test("Testing GET base api", () => {
    apiHandler.get("/api/", {headers: headers}, (value) => {
        expect(value["message"]).toMatch("Api GET gotten");
    })
});
test("Testing POST base api", () => {
    apiHandler.post("/api/", {headers: headers}, (value) => {
        expect(value["message"]).toMatch("Api POST gotten");
    })
});
test("Testing PUT base api", () => {
    apiHandler.put("/api/", {headers: headers}, (value) => {
        expect(value["message"]).toMatch("Api PUT gotten");
    })
});
test("Testing DELETE base api", () => {
    apiHandler.delete("/api/", {headers: headers},(value) => {
        expect(value["message"]).toMatch("Api DELETE gotten");
    })
});