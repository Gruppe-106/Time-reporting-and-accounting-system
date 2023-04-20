import {Request, Response} from "express";
import EndpointBase from "./endpointBase";

abstract class PostEndpointBase extends EndpointBase{
    /**
     * Submits the data to the MySQL database
     * @param req Request: request object of the requester
     * @param res Response: response object of the requester
     * @return string[]: returns either ["success"] if all went perfect, otherwise a list of messages.
     * Beware messages is returned from some endpoints even if they succeeded
     */
    abstract submitData(req:Request, res:Response): Promise<string[]>;

    /**
     * Does preliminary checks before submitting data to the database
     * @param req Request: request object of the requester
     * @param res Response: response object of the requester
     * @return {status:number, data: object}: status of the request and any data to return to requester
     */
    public async processRequest(req:Request, res:Response):Promise<{status:number, data: object}> {
        try {
            // Check if the body is empty
            if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
                return {status: 404, data: {success: "false", message: "Missing Body"}};
            }
            // First check if user is authorised
            if (await this.ensureAuth(req)) {
                // Try to submit data to DB
                let message: string[] = await this.submitData(req, res);
                // If something failed, send reasons to requester
                if (message[0] !== "success") {
                    return {status: 404, data: {success: "false", reasons: message}};
                }
                // Otherwise return success
                return {status: 200, data: {success: "true", message: message}};
            }
            // Tell requester they aren't authorised
            return {status: 401, data: {error: "Not authorized"}};
        } catch (e: unknown) {
            console.error(e);
            return {status: 404, data: {error: "Failed to submit data"}};
        }
    }

    /**
     * Base post route for an endpoint
     * @param req Request: request object of the requester
     * @param res Response: response object of the requester
     */
    public postRoute(req: Request, res: Response): void {
        // Calls the process request of the endpoint and send back the result to the requester
        this.processRequest(req, res).then((data) => {
            if (!res.writableEnded) {
                res.setHeader('Content-Type', 'application/json');
                res.status(data.status).json(data);
            }
        })
    };
}

export default PostEndpointBase;