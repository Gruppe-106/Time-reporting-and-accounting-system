import _endpointBase from "../_endpointBase";
import {PROJECTS} from "../../database/fakeData/PROJECTS";

export interface ProjectReturnType {
    id?: number,
    superProject?: number,
    name?: string,
    startDate?: number,
    endDate?: number
}

export class ProjectEndpointOld extends _endpointBase{
    table = PROJECTS.data;
    data: ProjectReturnType[];
}
