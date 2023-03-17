import EndpointBase from "../endpointBase";
import {PROJECTS} from "../../database/fakeData/PROJECTS";

export interface ProjectReturnType {
    id?: number,
    superProject?: number,
    name?: string,
    startDate?: number,
    endDate?: number
}

export class ProjectEndpoint extends EndpointBase{
    table = PROJECTS.data;
    data: ProjectReturnType[];
}
