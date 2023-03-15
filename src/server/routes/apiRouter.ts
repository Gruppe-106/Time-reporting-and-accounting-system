import {Router} from "express-serve-static-core";
import {Request, Response} from "express";
import {BaseRouter} from "../baseRouter";
import {ProjectEndpoint} from "../apiEndpoints/dataEndpoints/projectsEndpoint";

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

        this.router.get("/project/get", (req: Request, res: Response): void => {
            let ids = req.query.ids;
            let values = req.query.var;
            console.log(values)
            let requestedValues:string[];
            if (typeof values === "string" ) {
                requestedValues = values.split(",");
            } else {
                requestedValues = ["*"];
            }

            console.log(requestedValues);

            if (ids === undefined || typeof ids !== "string") {
                res.sendStatus(400)
                res.end();
                return;
            }
            let idList: string[] = ids.split(",");

            let projectEndpoint = new ProjectEndpoint(this.user);
            projectEndpoint.processRequest(requestedValues, "id", idList).then((data) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(data);
            })
        });
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