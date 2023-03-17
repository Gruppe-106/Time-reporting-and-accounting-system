import {Router} from "express-serve-static-core";
import {Request, Response} from "express";
import {BaseRouter} from "../baseRouter";
import {UserEndpoint} from "../apiEndpoints/dataEndpoints/userEndpoint";
import {TimeTypeEndpoint} from "../apiEndpoints/dataEndpoints/timeTypeEndpoint";
import {RoleEndpoint} from "../apiEndpoints/dataEndpoints/roleEndpoint";
import {UserRoleEndpoint} from "../apiEndpoints/dataEndpoints/userRoleEndpoint";
import {ManagerGroupEndpoint} from "../apiEndpoints/dataEndpoints/managerGroupEndpoint";
import {TaskProjectEndpoint} from "../apiEndpoints/dataEndpoints/taskProjectEndpoint";
import {TaskTimeRegisterEndpoint} from "../apiEndpoints/dataEndpoints/taskTimeRegisterEndpoint";
import {ProjectEndpoint} from "../apiEndpoints/dataEndpoints/projectEndpoint";
import {TaskEndpoint} from "../apiEndpoints/dataEndpoints/taskEndpoint";

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
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(JSON.stringify({message: "Api gotten"}));
        });

        this.router.get("/project/get",      (req: Request, res: Response) => new ProjectEndpoint(this.user).getRoute(req, res));
        this.router.get("/user/get",         (req: Request, res: Response) => new UserEndpoint(this.user).getRoute(req, res));
        this.router.get("/task/get",         (req: Request, res: Response) => new TaskEndpoint(this.user).getRoute(req, res));
        this.router.get("/task/project/get", (req: Request, res: Response) => new TaskProjectEndpoint(this.user).getRoute(req, res));
        this.router.get("/timetype/get",     (req: Request, res: Response) => new TimeTypeEndpoint(this.user).getRoute(req, res));
        this.router.get("/role/get",         (req: Request, res: Response) => new RoleEndpoint(this.user).getRoute(req, res));
        this.router.get("/role/user/get",    (req: Request, res: Response) => new UserRoleEndpoint(this.user).getRoute(req, res));
        this.router.get("/group/manager/get",(req: Request, res: Response) => new ManagerGroupEndpoint(this.user).getRoute(req, res));
        this.router.get("/time/register/get",(req: Request, res: Response) => new TaskTimeRegisterEndpoint(this.user).getRoute(req, res));
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