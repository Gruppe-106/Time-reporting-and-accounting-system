import EndpointBase from "../endpointBase";
import {ROLES} from "../../database/fakeData/ROLES";

export interface RoleReturnType {
    id?: number,
    name?: string,
}

export class RoleEndpoint extends EndpointBase {
    table = ROLES.data;
    data: RoleReturnType[];
}