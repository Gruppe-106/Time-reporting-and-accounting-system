import BaseApiHandler from "../../../client/src/network/baseApiHandler";
const apiHandler: BaseApiHandler = new BaseApiHandler("http://localhost:8080");

describe("Login API", () => {
    describe("POST API", () => {
        test("Fail case, no body", async () => {
            await new Promise((resolve) => {
                apiHandler.post("/api/login", {}, (value) => {
                    expect(value).toStrictEqual({status: 200, data: ["Missing password or email"]});
                    resolve(true);
                });
            });
        });

        test("Fail case, bad password", async () => {
            await new Promise((resolve) => {
                let bodyFail = {
                    email: "authexpired@example.com",
                    password: "4f31fa50e5bd5ff45684e560fc24aeee527a43739ab611c49c51098a33e2b469"
                }
                apiHandler.post("/api/login", {body: bodyFail}, (value) => {
                    expect(value).toStrictEqual({status: 200, data: ['Password or email incorrect']});
                    resolve(true);
                });
            });
        });

        test("Success case", async () => {
            await new Promise((resolve) => {
                let bodySuccess = {
                    email: "authexpired@example.com",
                    password: "78675cc176081372c43abab3ea9fb70c74381eb02dc6e93fb6d44d161da6eeb3"
                }

                apiHandler.post("/api/login", {body: bodySuccess}, (value) => {
                    expect(value["data"][0]).toMatch("success");
                    expect(parseInt(value["data"][2])).toBeGreaterThan(Date.now());
                    resolve(true);
                })
            });
        });
    });
});