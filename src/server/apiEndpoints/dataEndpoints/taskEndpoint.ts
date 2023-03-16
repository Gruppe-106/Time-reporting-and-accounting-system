import EndpointBase from "../endpointBase";
import {TASKS} from "../../database/fakeData/TASKS";

export interface TaskReturnType {
    id?: number,
    name?: string,
    startDate?: number,
    endDate?: number,
    timeType?: number
}

export class TaskEndpoint extends EndpointBase {
    table = TASKS.data;
    data: TaskReturnType[];
}