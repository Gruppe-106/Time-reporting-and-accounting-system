class BaseApiHandler {
    private baseUrl: string;
    private authKey: string;

    constructor(authKey?:string, baseUrl?:string) {
        this.baseUrl = baseUrl === undefined ? /*window.location.host*/ "" : baseUrl; //Commented out to work in dev environment
        this.authKey = authKey === undefined ? "" : authKey;
    }

    //Setter functions for authKey
    public setAuthKey(authKey:string):void {
        this.authKey = authKey;
    }

    //Setter functions for baseUrl aka hostname
    public setBaseUrl(url:string):void {
        this.baseUrl = url;
    }

    /**
     * Sent GET request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param callback Callback?: an anonymous function to run after data is received, the value will be the json object
     * @param baseUrl String?: the hostname of the url
     * @param headers Record<string, string>?: Headers for request in key-value pairs
     * @param contentType String?: content type sent to the server
     */
    public get(urlPath:string, callback?:(value:JSON)=>void, baseUrl?:string, headers?:Record<string, string>, contentType?:string):boolean {
        //Check if required authKey is present
        if (this.authKey === "") { return false; }
        this.requester(urlPath, baseUrl, "GET", null, headers, contentType).then(callback);
        return true;
    }

    /**
     * Sent POST request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param callback Callback?: an anonymous function to run after data is received, the value will be the json object or void
     * @param baseUrl String?: the hostname of the url
     * @param message String | Object?: message or data to send (Auto converts to JSON format)
     * @param headers Record<string, string>?: Headers for request in key-value pairs
     * @param contentType String?: content type sent to the server
     */
    public post(urlPath:string, callback?:(value:JSON)=>void, baseUrl?:string, message?:object | string, headers?:Record<string, string>, contentType?:string):boolean {
        //Check if required authKey is present
        if (this.authKey === "") { return false; }
        this.requester(urlPath, baseUrl, "POST", message, headers, contentType).then(callback);
        return true;
    }

    /**
     * Sent request to url
     * @param urlPath String: path of the url meaning not hostname
     * @param baseUrl String: the hostname of the url
     * @param method String: method of request eg. POST, GET...
     * @param message String | Object: message or data to send (Auto converts to JSON format)
     * @param headers Record<string, string>: Headers for request in key-value pairs
     * @param contentType String: content type sent to the server
     * @private
     */
    private async requester(urlPath:string, baseUrl:string = this.baseUrl, method:string = "GET", message:null | object | string = "", headers:Record<string, string> = {}, contentType:string = "text/plain"):Promise<JSON>{
        let url:string = baseUrl + urlPath;
        //Setup standard headers
        headers["Content-type"] = contentType;
        headers["Auth-Key"]     = this.authKey;
        headers["Accept"]       = "application/json";

        //Make request to node server
        return await fetch(url, {
            method: method,
            headers: headers,
            body: message === null ? null : JSON.stringify(message)
        })
            //Create task/promise for converting response to json
            .then((response) => { return response.json(); })
            //Check the created json
            .then((value) => {
            if (value) { return value; }
            //Throw an error if the response could not be converted to json
            else { throw new Error("Value is void"); }
        })
    }
}

export default BaseApiHandler;