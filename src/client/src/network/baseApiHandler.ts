class BaseApiHandler {
    private baseUrl: string;
    private authKey: string;

    constructor(authKey?:string, baseUrl?:string) {
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
    public get(urlPath:string, callback?:(value:Object)=>void, baseUrl?:string, headers?:Record<string, string>):boolean {
        //Check if required authKey is present
        if (this.authKey === "") { return false; }
        this.requester(urlPath, baseUrl, "GET", null, headers).then(callback);
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
    public post(urlPath:string, callback?:(value:Object)=>void, baseUrl?:string, message?:object | string, headers?:Record<string, string>):boolean {
        //Check if required authKey is present
        if (this.authKey === "") { return false; }
        this.requester(urlPath, baseUrl, "POST", message, headers).then(callback);
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
    private async requester(urlPath:string, baseUrl:string = this.baseUrl, method:string = "GET", message:null | object | string = "", headers:Record<string, string> = {}):Promise<Object>{
        let url:string = baseUrl + urlPath;

        //Setup standard headers
        headers["Content-Type"] = "application/json";
        headers["Auth-Key"]     = this.authKey;
        headers["Accept"]       = "application/json";

        let body = message === null ? null : JSON.stringify(message)

        //Make request to node server
        return await fetch(url, {
            method: method,
            headers: headers,
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