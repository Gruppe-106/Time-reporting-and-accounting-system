import _endpointBase from "../_endpointBase";
import {TASKS} from "../../database/fakeData/TASKS";

export interface TaskReturnType {
    id?: number,
    name?: string,
    startDate?: number,
    endDate?: number,
    timeType?: number
}

export class TaskEndpointOld extends _endpointBase {
    table = TASKS.data;
    data: TaskReturnType[];
}