import EndpointBase, {User} from "../endpointBase";
import {TIMETYPE} from "../../database/fakeData/TIMETYPE";

interface TimeTypeReturnType {
    id?: number,
    name?: string,
}

export class TimeTypeEndpoint extends EndpointBase {
    table = TIMETYPE.data;
    data: TimeTypeReturnType[];
}