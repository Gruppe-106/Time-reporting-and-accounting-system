import {Router} from "express-serve-static-core";
import {Request, Response} from "express";
import {BaseRouter} from "../baseRouter";
import {projectGetRoute} from "../apiEndpoints/dataEndpoints/projectEndpoint";
import {userGetRoute} from "../apiEndpoints/dataEndpoints/userEndpoint";
import {taskGetRoute} from "../apiEndpoints/dataEndpoints/taskEndpoint";
import {timeTypeGetRoute} from "../apiEndpoints/dataEndpoints/timeTypeEndpoint";
import {roleGetRoute} from "../apiEndpoints/dataEndpoints/roleEndpoint";
import {userRoleGetRoute} from "../apiEndpoints/dataEndpoints/userRoleEndpoint";
import {managerGroupGetRoute} from "../apiEndpoints/dataEndpoints/managerGroupEndpoint";
import {timeRegisterGetRoute} from "../apiEndpoints/dataEndpoints/timeRegisterEndpoint";

/* Implement this shit and ensure CORS
    res.setHeader("Access-Control-Allow-Origin" , "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Auth-Key");
 */

export class ApiRouter extends BaseRouter {
    //Temporary
    private user = { authKey: "test", id: 1, role: 3};

    private getRoutes() {
        this.router.get("/", (req: Request, res: Response): void => {
            res.setHeader('Content-Type'                , 'application/json');
            res.status(200).json(JSON.stringify({message: "Api gotten"}));
        });

        this.router.get("/project/get", (req: Request, res: Response) => projectGetRoute(req, res, this.user));
        this.router.get("/user/get", (req: Request, res: Response) => userGetRoute(req, res, this.user));
        this.router.get("/task/get", (req: Request, res: Response) => taskGetRoute(req, res, this.user));
        this.router.get("/timetype/get", (req: Request, res: Response) => timeTypeGetRoute(req, res, this.user));
        this.router.get("/role/get", (req: Request, res: Response) => roleGetRoute(req, res, this.user));
        this.router.get("/role/user/get", (req: Request, res: Response) => userRoleGetRoute(req, res, this.user));
        this.router.get("/group/manager/get", (req: Request, res: Response) => managerGroupGetRoute(req, res, this.user));
        this.router.get("/time/register/get", (req: Request, res: Response) => timeRegisterGetRoute(req, res, this.user));
    }

    private postRoutes() {
        this.router.post("/", (req: Request, res: Response): void => {
            res.send("Api post");
        })
    }

    public routes(): Router {
        this.getRoutes();
        this.postRoutes();
        return this.router;
    }
}