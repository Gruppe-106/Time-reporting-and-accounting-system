import { Component } from "react";
import { Button, Container } from "react-bootstrap";
import BaseNavBar from "../../components/navBar";
import BaseApiHandler from "../../network/baseApiHandler";
import {getCurrentMonthInterval} from "../../utility/timeConverter";

interface RecUserModel {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    group: number
}

interface UserData {
    id: number,
    lastName: string,
    firstName: string,
    projects: ProjectData[],
}

interface ProjectData {
    projectId: number,
    projectName: string
    tasks: TaskData[]
}

interface TaskData {
    taskId: number,
    taskName: string,
    totalHours: number,
    registrations: TimeRegistration[],
}

interface TimeRegistration {
    date: number,
    time: number,
}

interface RecUserData {
    status: number,
    data: RecUserModel[]
}

interface RecTimesheetData {
    status: number,
    data: RecTimesheetModel[]
}

interface RecTimesheetModel {
    taskId: number,
    taskName: string,
    projectName: string,
    projectId: number
    date: number,
    userId: number,
    time: number,
    approved: boolean,
    managerLogged: boolean
}

class DataExport extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    private async getAllUsers(): Promise<RecUserData> {
        let api:BaseApiHandler = new BaseApiHandler(); // Handles api requests.
        let url: string = "/api/user/get?ids=*" // The url needed to get users. Star symbolizes all users.
        let promise: Promise<RecUserData> = new Promise((res) => { // Basically we don't care for reject.
            api.get(url, {}, (resp) => {
                // Get the server response and turn it to JSON.
                let data: RecUserData = JSON.parse(JSON.stringify(resp))

                if (data.status !== 200) { // If the request went wrong, let 'em know.
                    alert("Something went wrong with the query for all users.");
                    data = {
                        data: [],
                        status: -1
                    }
                }
                res(data); // Resolve the promise.
            });
        })
        return await promise; // Return the promise.
    }

    private async getAllTimesheets(period: [number, number], userIds: number[]): Promise<RecTimesheetData> {
        // Construct the URL for the API request using the user IDs
        let url: string = "/api/time/register/get?user=";
        for (let i = 0; i < userIds.length; i++) {
            const element = userIds[i];
            if (i === 0) {
                url += `${element}`
            } else {
                url += `,${element}`
            }
        }

        // Set the period in which we want time registrations.
        url += `&period=${period[0]},${period[1]}`;

        // Create a promise that resolves to the timesheet data
        let promise: Promise<RecTimesheetData> = new Promise((res) => {
            // Make the API request
            let api:BaseApiHandler = new BaseApiHandler();
            api.get(url, {}, (resp) => {
                // Parse the response and check that the status is 200
                let timesheetData: RecTimesheetData = JSON.parse(JSON.stringify(resp));
                if (timesheetData.status !== 200) {
                    alert("Request went wrong.")
                    throw new Error("Not status 200 on timesheet request.");
                }
                // Resolve the promise with the timesheet data
                res(timesheetData);
            })
        })

        // Await the promise and return the timesheet data
        return await promise;
    }

    private async getAllData(): Promise<void> {
        let userRecData: RecUserData = await this.getAllUsers();
        userRecData.data.sort(this.comparerFuncRecUserData);

        let userIds: number[] = [];
        let [monthStart, monthEnd]: [number, number] = getCurrentMonthInterval();
        for (let i = 0; i < userRecData.data.length; i++) userIds.push(userRecData.data[i].id);
        let timesheetRecData: RecTimesheetData = await this.getAllTimesheets([monthStart, monthEnd], userIds);
        timesheetRecData.data.sort(this.comparerFuncRecTimesheetData);

        let allData: UserData[] = [];
        for (let i = 0; i < userRecData.data.length; i++) {
            let recUser: RecUserModel = userRecData.data[i];
            allData.push(this.recUserToUserData(recUser));
            let range: [number, number] = this.getRangeOfUserID(timesheetRecData.data, recUser.id);
            allData[i].projects = this.timesheetRangeToProjects(timesheetRecData.data, range);
        }

        this.downloadCSV(allData);
    }

    private timesheetRangeToProjects(data: RecTimesheetModel[], range: [number, number]): ProjectData[] {
        let pData: ProjectData[] = [];
        if (range[0] == -1 && range[1] == -1 ||
            range[0] > range[1]) {
            return pData;
        }

        pData.push(this.createProjectDataFromTimesheet(data[range[0]]))

        if (range[0] == range[1]) {
            return pData;
        }

        if (range[0] < range[1]) {
            let index: number = range[0] + 1;
            let prevTimesheet = data[range[0]];
            let pCount = 1;
            let tCount = 1;
            while (index <= range[1]) {
                let currTimesheet = data[index];
                if (currTimesheet.managerLogged && currTimesheet.approved) {
                    index++;
                    continue;
                }

                if (prevTimesheet.taskId === currTimesheet.taskId) {
                    // Append information to same task.
                    this.appendInfoToTask(currTimesheet, pData[pCount - 1].tasks[tCount - 1]);
                }
                else if (
                    prevTimesheet.projectId === currTimesheet.projectId &&
                    prevTimesheet.taskId !== currTimesheet.taskId
                ) {
                    // Same project but new task. Append new task info.
                    this.appendNewTaskToProject(currTimesheet, pData[pCount - 1]);
                    tCount++;
                }
                else {
                    // New project. Create a new project.
                    pData.push(this.createProjectDataFromTimesheet(currTimesheet));
                    pCount++;
                    tCount = 1;
                }
                index++;
            }
        }

        return pData;
    }

    private downloadCSV(convertedData: UserData[]): void {
        // Amount of data that can be downloaded should be inhibited by amount of RAM available in the browser window.
        let csvText: string = this.convertToCSV(convertedData);
        // Convert the string to bytes
        let bytes = new TextEncoder().encode(csvText);

        // Create a blob with the bytes
        let blob = new Blob([bytes], { type: "text/plain;charset=utf-8" });

        // Create a URL for the blob
        let url = URL.createObjectURL(blob);

        // Create a link element with the URL and download attribute
        let link = document.createElement("a");
        link.href = url;
        link.download = "data.csv";

        // Simulate a click on the link to trigger the download
        link.click();
    }

    private convertToCSV(convertedData: UserData[]): string {
        let headerElements = ["Last name", "First name", "Id", "Project", "Id", "Task", "Id", "Total minutes(task)"]
        let delimiter = ';'
        let headerLine = `"${headerElements.join(`"${delimiter}"`)}"`;
        // Just joins all the elements above with a ' ";" ' in between and at the two ends ' " '.
        let allText = "" + headerLine;
        for (let i = 0; i < convertedData.length; i++) {
            const userData: UserData = convertedData[i];

            for (let j = 0; j < userData.projects.length; j++) {
                const projectData: ProjectData = userData.projects[j];

                for (let k = 0; k < projectData.tasks.length; k++) {
                    const taskData: TaskData = projectData.tasks[k];
                    let varList = [userData.lastName, userData.firstName, userData.id, projectData.projectName, projectData.projectId, taskData.taskName, taskData.taskId, taskData.totalHours];
                    allText += `\n"${varList.join(`"${delimiter}"`)}"`;
                    // For all tasks we need to create a new line in the csv containing all info.
                    // Joins the elements the same way the header works.
                }
            }
        }
        return allText;
    }

    private createProjectDataFromTimesheet(recTimesheet: RecTimesheetModel): ProjectData {
        return {
            projectId: recTimesheet.projectId,
            projectName: recTimesheet.projectName,
            tasks: [this.createNewTask(recTimesheet)],
        }
    }

    private createNewTask(recTimesheet: RecTimesheetModel): TaskData {
        return {
            taskId: recTimesheet.taskId,
            taskName: recTimesheet.taskName,
            totalHours: recTimesheet.time,
            registrations: [this.createNewRegistration(recTimesheet)],
        }
    }

    private createNewRegistration(recTimesheet: RecTimesheetModel): TimeRegistration {
        return {
            date: recTimesheet.date,
            time: recTimesheet.time,
        }
    }

    private appendInfoToTask(recTimesheet: RecTimesheetModel, task: TaskData): void {
        task.totalHours += recTimesheet.time;
        task.registrations.push(this.createNewRegistration(recTimesheet));
    }

    private appendNewTaskToProject(recTimesheet: RecTimesheetModel, project: ProjectData): void {
        project.tasks.push(this.createNewTask(recTimesheet));
    }

    private comparerFuncRecUserData(a: RecUserModel, b: RecUserModel): number {
        // lastname -> firstname -> email -> id
        if (a.lastName !== b.lastName) {
            if (a.lastName < b.lastName) return -1;
            return 1;
        }
        if (a.firstName !== b.firstName) {
            if (a.firstName < b.firstName) return -1;
            return 1;
        }
        if (a.email !== b.email) {
            if (a.email < b.email) return -1;
            return 1;
        }
        if (a.id - b.id !== 0) return a.id - b.id;
        return 0;
    }

    private comparerFuncRecTimesheetData(a: RecTimesheetModel, b: RecTimesheetModel): number {
        // userId -> pName -> pId -> tName -> tId -> approved -> managerLogged -> time -> date
        if (a.userId !== b.userId) return a.userId - b.userId;
        if (a.projectName !== b.projectName) {
            if (a.projectName < b.projectName) return -1;
            return 1;
        }
        if (a.projectId !== b.projectId) return a.projectId - b.projectId;
        if (a.taskName !== b.taskName) {
            if (a.taskName < b.taskName) return -1;
            return 1;
        }
        if (a.taskId !== b.taskId) return a.taskId - b.taskId;
        if (a.approved !== b.approved) {
            if (a.approved) return -1;
            return 1;
        }
        if (a.managerLogged !== b.managerLogged) {
            if (a.managerLogged) return -1;
            return 1;
        }
        if (a.time !== b.time) return a.time - b.time;
        if (a.date !== b.date) return a.date - b.date;
        return 0;
    }

    private getRangeOfUserID(lst: RecTimesheetModel[], userId: number): [number, number] {
        let start: number = 0;
        let end: number = lst.length - 1;
        return this.getRangeOfUserIDAux(lst, userId, start, end);
    }

    private getRangeOfUserIDAux(lst: RecTimesheetModel[], userId: number, start: number, end: number): [number, number] {
        if (start < end) {
            let mid: number = Math.floor((start + end)/2);
            if (lst[mid].userId === userId) {
                let startIndex: number = mid, endIndex: number = mid;
                while (start <= startIndex && lst[startIndex].userId === userId) {
                    startIndex -= 1;
                }
                startIndex += 1;
                while (endIndex <= end && lst[endIndex].userId === userId) {
                    endIndex += 1;
                }
                endIndex -= 1;
                return [startIndex, endIndex];
            }
            else if (lst[mid].userId < userId) return this.getRangeOfUserIDAux(lst, userId, mid + 1, end);
            else if (userId < lst[mid].userId) return this.getRangeOfUserIDAux(lst, userId, start, mid - 1);
        }
        if (start == end) {
            if (lst[start].userId === userId) {
                return [start, start];
            }
        }
        return [-1, -1];
    }

    private recUserToUserData(recUser: RecUserModel): UserData {
        return {
            firstName: recUser.firstName,
            id: recUser.id,
            lastName: recUser.lastName,
            projects: []
        }
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container className="p-3">
                    <h1>DataExport</h1>
                    <Button onClick={() => this.getAllData()}>Get all data!</Button>
                </Container>
            </>
        );
    }
}


export default DataExport;