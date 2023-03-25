import {Request, Response} from "express";
import EndpointBase from "./endpointBase";

abstract class GetEndpointBase extends EndpointBase{
    abstract submitData(req:Request, res:Response): Promise<string[]>;

    public async processRequest(req:Request, res:Response):Promise<{status:number, data: object}> {
        try {
            if (await this.ensureAuth(req)) {
                let message: string[] = await this.submitData(req, res);
                if (message[0] !== "success") {
                    return {status: 404, data: {success: "false", reasons: message}};
                }
                return {status: 200, data: {success: "true", message: message}};
            }
            return {status: 401, data: {error: "Not authorized"}};
        } catch (e) {
            console.error(e);
            return {status: 404, data: {error: "Failed to submit data"}};
        }
    }

    public postRoute(req: Request, res: Response) {
        this.processRequest(req, res).then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(data.status).json(data);
        })
    };
}

export default GetEndpointBase;