import EndpointBase, {User} from "../endpointBase";
import {PROJECTS} from "../../database/fakeData/PROJECTS";

interface ReturnType {
    id?: number,
    super_project?: number,
    name?: string,
    start_date?: string,
    end_date?: string
}

export class ProjectEndpoint extends EndpointBase{
    private table = new PROJECTS().data;

    getData(requestValues: string[], user: User, primaryKey: string, keyEqual?: string[]):object {
        let data:ReturnType[] = [];
        let dataIndex = 0;
        for (const entry of this.table) {
            if (keyEqual.indexOf(entry[primaryKey].toString()) !== -1 || keyEqual.indexOf("*") !== -1) {
                data[dataIndex] = {}
                if (requestValues.indexOf("*") !== -1) {
                    data[dataIndex] = entry;
                } else {
                    for (const request of requestValues) {
                        if (entry[request]) data[dataIndex][request] = entry[request];
                    }
                }
                dataIndex++;
            }
        }
        return data;
    }
}