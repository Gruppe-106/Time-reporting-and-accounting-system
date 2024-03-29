import Cookies from "js-cookie";

// For testing on local Database
// TODO: Change to an environment variable
const localMode = false;

interface PostSettings {
    baseUrl?: string,
    body?: object | string,
    headers?: Record<string, string>,
    authKey?: string
}

interface GetSettings {
    baseUrl?: string,
    headers?: Record<string, string>,
    authKey?: string
}

interface RequesterSettings {
    baseUrl: string,
    method: string,
    body: null | object | string,
    headers: Record<string, string>,
    authKey?: string
}

class BaseApiHandler {
    // Only useful if another api is needed
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl === undefined ? "https://10.92.1.237:8080" : baseUrl; //Commented out to work in dev environment
    }

    /**
     * Sent GET request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param callback Callback?: an anonymous function to run after data is received, the value will be the json object
     * @param settings GetSettings: settings for get request
     */
    public async get(urlPath: string, settings: GetSettings, callback?: (value: Object) => void) {
        this.requester(urlPath, {
            baseUrl: settings.baseUrl || this.baseUrl,
            method: "GET",
            body: null,
            headers: settings.headers || {},
            authKey: settings.authKey
        }).then(callback);
        return true;
    }

    /**
     * Sent POST request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param settings PostSettings: settings for post request
     * @param callback Callback?: an anonymous function to run after data is received, the value will be the json object or void
     */
    public post(urlPath: string, settings: PostSettings, callback?: (value: Object) => void,): boolean {
        this.requester(urlPath,
            {
                baseUrl: settings.baseUrl || this.baseUrl,
                method: "POST",
                body: settings.body || null,
                headers: settings.headers || {},
                authKey: settings.authKey
            })
            .then(callback);
        return true;
    }

    /**
     * Sent PUT request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param settings PostSettings: settings for post request
     * @param callback Callback?: an anonymous function to run after data is received, the value will be the json object or void
     */
    public put(urlPath: string, settings: PostSettings, callback?: (value: Object) => void,): boolean {
        this.requester(urlPath,
            {
                baseUrl: settings.baseUrl || this.baseUrl,
                method: "PUT",
                body: settings.body || null,
                headers: settings.headers || {},
                authKey: settings.authKey
            })
            .then(callback);
        return true;
    }

    /**
     * Sent DELETE request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param callback Callback?: an anonymous function to run after data is received, the value will be the json object
     * @param settings GetSettings: settings for get request
     */
    public delete(urlPath: string, settings: GetSettings, callback?: (value: Object) => void): boolean {
        this.requester(urlPath, {
            baseUrl: settings.baseUrl || this.baseUrl,
            method: "DELETE",
            body: null,
            headers: settings.headers || {},
            authKey: settings.authKey
        }).then(callback);
        return true;
    }

    /**
     * Sent request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param settings RequesterSettings: settings for request
     * @private
     */
    // baseUrl:string = this.baseUrl, method:string = "GET", message:null | object | string = "", headers:Record<string, string> = {}
    private async requester(urlPath: string, settings: RequesterSettings): Promise<Object> {
        let url: string = this.baseUrl + urlPath;
        if (localMode) url = "https://localhost:8080" + urlPath;
        //Setup standard headers
        settings.headers["Content-Type"] = "application/json";
        settings.headers["Accept"] = "application/json";
        settings.headers["Auth-token"] = settings.authKey ?? Cookies.get("auth") ?? "";

        let body = settings.body === null ? null : JSON.stringify(settings.body)

        //Make request to node server
        return await fetch(url, {
            //credentials: "include",
            method: settings.method,
            headers: settings.headers,
            body: body
        })
            //Create task/promise for converting response to json
            .then((response) => {
                return response.text();
            })
            //Check the created json
            .then((value) => {
                //console.log(value)
                if (value) {
                    if (value.includes("<!DOCTYPE html>")) {
                        console.log(value);
                        return JSON.parse(`{"error" : "${value.toString()}"}`)
                    }
                    return JSON.parse(value);
                }
                //Throw an error if the response could not be converted to json
                else { throw new Error("Value is void"); }
            })
    }
}

export default BaseApiHandler;