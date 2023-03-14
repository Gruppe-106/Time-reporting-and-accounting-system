import path from "path";


abstract class BaseApiHandler {
    private baseUrl: string;

    constructor() {
        this.baseUrl = window.location.host;
    }

    public setBaseUrl(url:string):void {
        this.baseUrl = url;
    }

    public async get(urlPath:string, baseUrl:string = this.baseUrl, message:object | string = "", headers:Record<string, string> = {}, contentType:string = "text/plain"):Promise<JSON> {
        return this.requster(urlPath, baseUrl, "GET", message, headers, contentType);
    }

    public async post(urlPath:string, baseUrl:string = this.baseUrl, message:object | string = "", headers:Record<string, string> = {}, contentType:string = "text/plain"):Promise<JSON> {
        return this.requster(urlPath, baseUrl, "POST", message, headers, contentType);
    }

    private async requster(urlPath:string, baseUrl:string = this.baseUrl, method:string = "GET", message:object | string = "", headers:Record<string, string> = {}, contentType:string = "text/plain"):Promise<JSON> {
        let url:string = path.join(baseUrl, urlPath);

        headers["Content-type"] = contentType;
        let response = await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(message)
        });
        if (!(response.status >= 200 && response.status < 300)) {
            console.error(`[Error] Server responded with status: ${response.status} on url: ${url}`);
        }
        return await response.json();
    }
}

export default BaseApiHandler;