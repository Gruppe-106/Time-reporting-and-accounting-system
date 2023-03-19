import _endpointBase from "../_endpointBase";
import {ROLES} from "../../database/fakeData/ROLES";

export interface RoleReturnType {
    id?: number,
    name?: string,
}

export class RoleEndpointOld extends _endpointBase {
    table = ROLES.data;
    data: RoleReturnType[];
}