import {Router} from "express-serve-static-core";
import express, {Request, Response} from "express";
import {BaseRouter} from "../baseRouter";
import {UserEndpointOld} from "../apiEndpoints/dataEndpoints/userEndpoint";
import {TimeTypeEndpointOld} from "../apiEndpoints/dataEndpoints/timeTypeEndpoint";
import {RoleEndpointOld} from "../apiEndpoints/dataEndpoints/roleEndpoint";
import {UserRoleEndpointOld} from "../apiEndpoints/dataEndpoints/userRoleEndpoint";
import {ManagerGroupEndpointOld} from "../apiEndpoints/dataEndpoints/managerGroupEndpoint";
import {TaskProjectEndpointOld} from "../apiEndpoints/dataEndpoints/taskProjectEndpoint";
import {TaskTimeRegisterEndpointOld} from "../apiEndpoints/dataEndpoints/taskTimeRegisterEndpoint";
import {ProjectEndpointOld} from "../apiEndpoints/dataEndpoints/projectEndpoint";
import {TaskEndpointOld} from "../apiEndpoints/dataEndpoints/taskEndpoint";
import UserCreationEndpoint from "../apiEndpoints/dataPostEndpoints/userCreationEndpoint";
import ProjectEndpoint from "../apiEndpoints/dataGetEndpoints/projectEndpoint";
import RoleEndpoint from "../apiEndpoints/dataGetEndpoints/roleEndpoint";
import TaskEndpoint from "../apiEndpoints/dataGetEndpoints/taskEndpoint";
import TimeTypeEndpoint from "../apiEndpoints/dataGetEndpoints/timeTypeEndpoint";
import UserEndpoint from "../apiEndpoints/dataGetEndpoints/userEndpoint";
import TaskProjectEndpoint from "../apiEndpoints/dataGetEndpoints/taskProjectEndpoint";
import ManagerGroupEndpoint from "../apiEndpoints/dataGetEndpoints/managerGroupEndpoint";
import UserRoleEndpoint from "../apiEndpoints/dataGetEndpoints/userRoleEndpoint";
import TaskTimeRegisterEndpoint from "../apiEndpoints/dataGetEndpoints/taskTimeRegisterEndpoint";

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
            res.status(200).json({message: "Api GET gotten"});
        });

        this.router.get("/project/get",      (req: Request, res: Response) => new ProjectEndpointOld(this.user).getRoute(req, res));
        this.router.get("/user/get",         (req: Request, res: Response) => new UserEndpointOld(this.user).getRoute(req, res));
        this.router.get("/task/get",         (req: Request, res: Response) => new TaskEndpointOld(this.user).getRoute(req, res));
        this.router.get("/task/project/get", (req: Request, res: Response) => new TaskProjectEndpointOld(this.user).getRoute(req, res));
        this.router.get("/timetype/get",     (req: Request, res: Response) => new TimeTypeEndpointOld(this.user).getRoute(req, res));
        this.router.get("/role/get",         (req: Request, res: Response) => new RoleEndpointOld(this.user).getRoute(req, res));
        this.router.get("/role/user/get",    (req: Request, res: Response) => new UserRoleEndpointOld(this.user).getRoute(req, res));
        this.router.get("/group/manager/get",(req: Request, res: Response) => new ManagerGroupEndpointOld(this.user).getRoute(req, res));
        this.router.get("/time/register/get",(req: Request, res: Response) => new TaskTimeRegisterEndpointOld(this.user).getRoute(req, res));

        //V.2
        this.router.get("/v2/project/get",      (req: Request, res: Response) => new ProjectEndpoint(this.user).getRoute(req, res));
        this.router.get("/v2/user/get",         (req: Request, res: Response) => new UserEndpoint(this.user).getRoute(req, res));
        this.router.get("/v2/task/get",         (req: Request, res: Response) => new TaskEndpoint(this.user).getRoute(req, res));
        this.router.get("/v2/task/project/get", (req: Request, res: Response) => new TaskProjectEndpoint(this.user).getRoute(req, res));
        this.router.get("/v2/timetype/get",     (req: Request, res: Response) => new TimeTypeEndpoint(this.user).getRoute(req, res));
        this.router.get("/v2/role/get",         (req: Request, res: Response) => new RoleEndpoint(this.user).getRoute(req, res));
        this.router.get("/v2/role/user/get",    (req: Request, res: Response) => new UserRoleEndpoint(this.user).getRoute(req, res));
        this.router.get("/v2/group/manager/get",(req: Request, res: Response) => new ManagerGroupEndpoint(this.user).getRoute(req, res));
        this.router.get("/v2/time/register/get",(req: Request, res: Response) => new TaskTimeRegisterEndpoint(this.user).getRoute(req, res, "userId", "user"));
    }

    private postRoutes() {
        this.router.use(express.json());
        this.router.post("/", (req: Request, res: Response): void => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({message: "Api POST gotten"});
        })

        this.router.post("/user/creation/post", (req: Request, res:Response) => new UserCreationEndpoint().postRoute(req, res))
    }

    public routes(): Router {
        this.getRoutes();
        this.postRoutes();
        return this.router;
    }
}