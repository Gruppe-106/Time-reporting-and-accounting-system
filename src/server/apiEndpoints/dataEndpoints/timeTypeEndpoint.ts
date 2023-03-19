import _endpointBase from "../_endpointBase";
import {TIMETYPE} from "../../database/fakeData/TIMETYPE";

interface TimeTypeReturnType {
    id?: number,
    name?: string,
}

export class TimeTypeEndpointOld extends _endpointBase {
    table = TIMETYPE.data;
    data: TimeTypeReturnType[];
}