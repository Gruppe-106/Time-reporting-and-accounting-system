interface PostSettings {
    baseUrl?: string,
    body?: object | string,
    headers?: Record<string, string>
}

interface GetSettings {
    baseUrl?: string,
    headers?: Record<string, string>
}

interface RequesterSettings {
    baseUrl: string,
    method: string,
    body: null | object | string,
    headers: Record<string, string>
}

class BaseApiHandler {
    private baseUrl: string;
    private authKey: string;

    constructor(authKey?: string, baseUrl?: string) {
        this.baseUrl = baseUrl === undefined ? /*window.location.host*/ "" : baseUrl; //Commented out to work in dev environment
        this.authKey = authKey === undefined ? "" : authKey;
    }

    /**
     * Sent GET request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param callback Callback?: an anonymous function to run after data is received, the value will be the json object
     * @param baseUrl String?: the hostname of the url
     * @param headers Record<string, string>?: Headers for request in key-value pairs
     */
    public get(urlPath: string, settings: GetSettings, callback?: (value: Object) => void): boolean {
        //Check if required authKey is present
        if (this.authKey === "") { return false; }
        this.requester(urlPath, {
            baseUrl: settings.baseUrl || this.baseUrl,
            method: "GET",
            body: null,
            headers: settings.headers || {}
        }).then(callback);
        return true;
    }

    /**
     * Sent POST request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param callback Callback?: an anonymous function to run after data is received, the value will be the json object or void
     * @param baseUrl String?: the hostname of the url
     * @param message String | Object?: message or data to send (Auto converts to JSON format)
     * @param headers Record<string, string>?: Headers for request in key-value pairs
     */
    public post(urlPath: string, settings: PostSettings, callback?: (value: Object) => void,): boolean {
        //Check if required authKey is present
        if (this.authKey === "") { return false; }
        this.requester(urlPath,
            {
                baseUrl: settings.baseUrl || this.baseUrl,
                method: "POST",
                body: settings.body || "",
                headers: settings.headers || {}
            })
            .then(callback);
        return true;
    }

    /**
     * Sent request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param baseUrl String: the hostname of the url
     * @param method String: method of request eg. POST, GET...
     * @param message String | Object: message or data to send (Auto converts to JSON format)
     * @param headers Record<string, string>: Headers for request in key-value pairs
     * @private
     */
    // baseUrl:string = this.baseUrl, method:string = "GET", message:null | object | string = "", headers:Record<string, string> = {}
    private async requester(urlPath: string, settings: RequesterSettings): Promise<Object> {
        let url: string = settings.baseUrl + urlPath;

        //Setup standard headers
        settings.headers["Content-Type"] = "application/json";
        settings.headers["Auth-Key"] = this.authKey;
        settings.headers["Accept"] = "application/json";

        let body = settings.body === null ? null : JSON.stringify(settings.body)

        //Make request to node server
        return await fetch(url, {
            method: settings.method,
            headers: settings.headers,
            body: body
        })
            //Create task/promise for converting response to json
            .then((response) => { return response.json(); })
            //Check the created json
            .then((value) => {
                //console.log(value)
                if (value) { return JSON.parse(JSON.stringify(value)); }
                //Throw an error if the response could not be converted to json
                else { throw new Error("Value is void"); }
            })
    }
}

export default BaseApiHandler;