import {USERS} from "./USERS";
import {AUTH} from "./AUTH";
import {GROUP} from "./GROUP";
import {PROJECTS} from "./PROJECTS";
import {ROLES} from "./ROLES";
import {TASKS} from "./TASKS";
import {TIMETYPE} from "./TIMETYPE";
import {TASK_PROJECTS_CONNECTOR} from "./TASK_PROJECTS_CONNECTOR";
import {USER_ROLES_CONNECTOR} from "./USER_ROLES_CONNECTOR";
import {USER_TASK_TIME_REGISTER} from "./USER_TASK_TIME_REGISTER";
import {USER_TASK_CONNECTOR} from "./USER_TASK_CONNECTOR";
import {PROJECTS_MANAGER_CONNECTOR} from "./PROJECTS_MANAGER_CONNECTOR";
import {Server} from "../../server";

class AddFakeDataToDB {
    private mysql = Server.mysql;
    private dateFormatter(date:number) {
        return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    }

    public addAll() {
        this.addUSERS();
        this.addAUTHS();
        this.addGROUP();
        this.addPROJECT();
        this.addROLES();
        this.addTIMETYPES();
        this.addTASKS();
        this.addTASKPROJECT();
        this.addUSERROLE();
        this.addUSERTASKTIMEREGISTER();
        this.addUSERSTASKS();
        this.addPROJECTSMANAGER()
    }

    public addUSERS() {
        let users = USERS.data;
        let values: string[][] = [];

        for (const user of users) {
            values.push([user.email, user.firstName, user.lastName, user.group.toString()]);
        }

        this.mysql.insert("USERS", ["email", "firstName", "lastName", "groupId"], values);
    }

    public addAUTHS() {
        let auths = AUTH.data;
        let values: string[][] = [];

        for (const auth of auths) {
            values.push([auth.email, auth.authKey, this.dateFormatter(auth.authKeyEndDate), auth.userId.toString(), auth.password]);
        }

        this.mysql.insert("AUTH", ["email", "authKey", "authKeyEndDate", "userId", "password"], values)
    }

    public addGROUP() {
        let groups = GROUP.data;
        let values: string[][] = [];

        for (const group of groups) {
            values.push([group.manager.toString(), group.id.toString()]);
        }

        this.mysql.insert("GROUPS_CONNECTOR", ["managerId", "groupId"], values)
    }

    public addPROJECT() {
        let projects = PROJECTS.data;
        let values: string[][] = [];

        for (const project of projects) {
            values.push([project.id.toString(), project.superProject.toString(), project.name, this.dateFormatter(project.startDate), this.dateFormatter(project.endDate)]);
        }

        this.mysql.insert("PROJECTS", ["id", "superProjectId", "name", "startDate", "endDate"], values)
    }

    public addROLES() {
        let roles = ROLES.data;
        let values: string[][] = [];

        for (const role of roles) {
            values.push([role.id.toString(), role.name]);
        }

        this.mysql.insert("ROLES", ["id", "name"], values)
    }

    public addTIMETYPES() {
        let timetypes = TIMETYPE.data;
        let values: string[][] = [];

        for (const timetype of timetypes) {
            values.push([timetype.id.toString(), timetype.name]);
        }

        this.mysql.insert("TIMETYPES", ["id", "name"], values)
    }

    public addTASKS() {
        let tasks = TASKS.data;
        let values: string[][] = [];

        for (const task of tasks) {
            values.push([task.id.toString(), task.name, this.dateFormatter(task.startDate), this.dateFormatter(task.endDate), task.timeType.toString()]);
        }

        this.mysql.insert("TASKS", ["id", "name", "startDate", "endDate", "timeType"], values)
    }

    public addTASKPROJECT() {
        let connectors = TASK_PROJECTS_CONNECTOR.data;
        let values: string[][] = [];

        for (const con of connectors) {
            values.push([con.taskId.toString(), con.projectId.toString()]);
        }

        this.mysql.insert("TASKS_PROJECTS_CONNECTOR", ["taskId", "projectId"], values)
    }

    public addUSERROLE() {
        let connectors = USER_ROLES_CONNECTOR.data;
        let values: string[][] = [];

        for (const con of connectors) {
            values.push([con.role.toString(), con.user.toString()]);
        }

        this.mysql.insert("USERS_ROLES_CONNECTOR", ["roleId", "userId"], values)
    }

    public addUSERTASKTIMEREGISTER() {
        let connectors = USER_TASK_TIME_REGISTER.data;
        let values: string[][] = [];

        for (const con of connectors) {
            values.push([this.dateFormatter(con.date), con.taskId.toString(), con.userId.toString(), con.time.toString(), con.approved ? "1" : "0", con.managerLogged ? "1" : "0"]);
        }

        this.mysql.insert("USERS_TASKS_TIME_REGISTER", ["date", "taskId", "userId", "time", "approved", "managerLogged"], values)
    }

    public addUSERSTASKS() {
        let connectors = USER_TASK_CONNECTOR.data;
        let values: string[][] = [];

        for (const con of connectors) {
            values.push([con.userId.toString(), con.taskId.toString()]);
        }

        this.mysql.insert("USERS_TASKS_CONNECTOR", ["userId", "taskId"], values)
    }

    public addPROJECTSMANAGER() {
        let connectors = PROJECTS_MANAGER_CONNECTOR.data;
        let values: string[][] = [];

        for (const con of connectors) {
            values.push([con.userId.toString(), con.projectId.toString()]);
        }

        this.mysql.insert("PROJECTS_MANAGER_CONNECTOR", ["userId", "projectId"], values)
    }
}

export default AddFakeDataToDB;