import {Router} from "express-serve-static-core";
import express, {Request, Response} from "express";
import {BaseRouter} from "../baseRouter";
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
import UserEditEndpoint from "../apiEndpoints/dataPostEndpoints/userEditEndpoint";
import ProjectCreationEndpoint from "../apiEndpoints/dataPostEndpoints/projectCreationEndpoint";
import LoginEndpoint from "../apiEndpoints/dataPostEndpoints/loginEndpoint";
import AuthEndpoint from "../apiEndpoints/dataGetEndpoints/authEndpoint";

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

        this.router.get("/auth",             (req: Request, res: Response) => new AuthEndpoint().getRoute(req, res));

        this.router.get("/project/get",      (req: Request, res: Response) => new ProjectEndpoint().getRoute(req, res));
        this.router.get("/user/get",         (req: Request, res: Response) => new UserEndpoint().getRoute(req, res));
        this.router.get("/task/get",         (req: Request, res: Response) => new TaskEndpoint().getRoute(req, res));
        this.router.get("/task/project/get", (req: Request, res: Response) => new TaskProjectEndpoint().getRoute(req, res));
        this.router.get("/timetype/get",     (req: Request, res: Response) => new TimeTypeEndpoint().getRoute(req, res));
        this.router.get("/role/get",         (req: Request, res: Response) => new RoleEndpoint().getRoute(req, res));
        this.router.get("/role/user/get",    (req: Request, res: Response) => new UserRoleEndpoint().getRoute(req, res));
        this.router.get("/group/manager/get",(req: Request, res: Response) => new ManagerGroupEndpoint().getRoute(req, res));
        this.router.get("/time/register/get",(req: Request, res: Response) => new TaskTimeRegisterEndpoint().getRoute(req, res, "userId", "user"));
    }

    private postRoutes() {
        this.router.use(express.json());
        this.router.post("/", (req: Request, res: Response): void => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({message: "Api POST gotten"});
        })

        this.router.post("/login",                (req: Request, res:Response) => new LoginEndpoint().postRoute(req, res));

        this.router.post("/user/creation/post",   (req: Request, res:Response) => new UserCreationEndpoint().postRoute(req, res));
        this.router.post("/user/edit/post",       (req: Request, res:Response) => new UserEditEndpoint().postRoute(req, res));
        this.router.post("/project/creation/post",(req: Request, res:Response) => new ProjectCreationEndpoint().postRoute(req, res));
    }

    public routes(): Router {
        this.getRoutes();
        this.postRoutes();
        return this.router;
    }
}