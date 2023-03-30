import PostEndpointBase from "../postEndpointBase";
import {Request, Response} from "express";
import {MySQLResponse, UpdateSet, Where} from "../../database/mysqlHandler";


class ProjectEditEndpoint extends PostEndpointBase {
    requiredRole: number = 4;
    async submitData(req: Request, res: Response): Promise<string[]> {
        return Promise.resolve(["success"]);
    }
}

export default ProjectEditEndpoint;