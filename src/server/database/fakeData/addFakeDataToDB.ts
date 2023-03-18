import {USERS} from "./USERS";
import {mysql} from "../../../app";
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

class AddFakeDataToDB {
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

        mysql.insert("users", ["email", "firstName", "lastName", "groupId"], values, (error, results, fields) => {
            console.log("users", error, results, fields);
        })
    }

    public addAUTHS() {
        let auths = AUTH.data;
        let values: string[][] = [];

        for (const auth of auths) {
            values.push([auth.email, auth.authKey, this.dateFormatter(auth.authKeyEndDate), auth.userId.toString(), auth.password]);
        }

        mysql.insert("auth", ["email", "authKey", "authKeyEndDate", "userId", "password"], values, (error, results, fields) => {
            console.log("auth", error, results, fields);
        })
    }

    public addGROUP() {
        let groups = GROUP.data;
        let values: string[][] = [];

        for (const group of groups) {
            values.push([group.manager.toString(), group.id.toString()]);
        }

        mysql.insert("groups_connector", ["managerId", "groupId"], values, (error, results, fields) => {
            console.log("groups_connector", error, results, fields);
        })
    }

    public addPROJECT() {
        let projects = PROJECTS.data;
        let values: string[][] = [];

        for (const project of projects) {
            values.push([project.id.toString(), project.superProject.toString(), project.name, this.dateFormatter(project.startDate), this.dateFormatter(project.endDate)]);
        }

        mysql.insert("projects", ["id", "superProjectId", "name", "startDate", "endDate"], values, (error, results, fields) => {
            console.log("projects", error, results, fields);
        })
    }

    public addROLES() {
        let roles = ROLES.data;
        let values: string[][] = [];

        for (const role of roles) {
            values.push([role.id.toString(), role.name]);
        }

        mysql.insert("roles", ["id", "name"], values, (error, results, fields) => {
            console.log("roles", error, results, fields);
        })
    }

    public addTIMETYPES() {
        let timetypes = TIMETYPE.data;
        let values: string[][] = [];

        for (const timetype of timetypes) {
            values.push([timetype.id.toString(), timetype.name]);
        }

        mysql.insert("timetypes", ["id", "name"], values, (error, results, fields) => {
            console.log("timetypes", error, results, fields);
        })
    }

    public addTASKS() {
        let tasks = TASKS.data;
        let values: string[][] = [];

        for (const task of tasks) {
            values.push([task.id.toString(), task.name, this.dateFormatter(task.startDate), this.dateFormatter(task.endDate), task.timeType.toString()]);
        }

        mysql.insert("tasks", ["id", "name", "startDate", "endDate", "timeType"], values, (error, results, fields) => {
            console.log("tasks", error, results, fields);
        })
    }

    public addTASKPROJECT() {
        let connectors = TASK_PROJECTS_CONNECTOR.data;
        let values: string[][] = [];

        for (const con of connectors) {
            values.push([con.taskId.toString(), con.projectId.toString()]);
        }

        mysql.insert("tasks_projects_connector", ["taskId", "projectId"], values, (error, results, fields) => {
            console.log("tasks_projects_connector", error, results, fields);
        })
    }

    public addUSERROLE() {
        let connectors = USER_ROLES_CONNECTOR.data;
        let values: string[][] = [];

        for (const con of connectors) {
            values.push([con.role.toString(), con.user.toString()]);
        }

        mysql.insert("users_roles_connector", ["roleId", "userId"], values, (error, results, fields) => {
            console.log("users_roles_connector", error, results, fields);
        })
    }

    public addUSERTASKTIMEREGISTER() {
        let connectors = USER_TASK_TIME_REGISTER.data;
        let values: string[][] = [];

        for (const con of connectors) {
            values.push([this.dateFormatter(con.date), con.taskId.toString(), con.userId.toString(), con.time.toString(), con.approved ? "1" : "0", con.managerLogged ? "1" : "0"]);
        }

        mysql.insert("users_tasks_time_register", ["date", "taskId", "userId", "time", "approved", "managerLogged"], values, (error, results, fields) => {
            console.log("users_tasks_time_register", error, results, fields);
        })
    }

    public addUSERSTASKS() {
        let connectors = USER_TASK_CONNECTOR.data;
        let values: string[][] = [];

        for (const con of connectors) {
            values.push([con.userId.toString(), con.taskId.toString()]);
        }

        mysql.insert("users_tasks_connector", ["userId", "taskId"], values, (error, results, fields) => {
            console.log("users_tasks_connector", error, results, fields);
        })
    }

    public addPROJECTSMANAGER() {
        let connectors = PROJECTS_MANAGER_CONNECTOR.data;
        let values: string[][] = [];

        for (const con of connectors) {
            values.push([con.userId.toString(), con.projectId.toString()]);
        }

        mysql.insert("projects_manager_connector", ["userId", "projectId"], values, (error, results, fields) => {
            console.log("projects_manager_connector", error, results, fields);
        })
    }
}

export default AddFakeDataToDB;