import * as fs from "fs";

export function fsReadJSON(path: string): any {
    return JSON.parse(fs.readFileSync(path, {encoding: "utf-8"}));
}