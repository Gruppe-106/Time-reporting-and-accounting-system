import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";
import BaseApiHandler from "../../network/baseApiHandler";
import { Button } from "react-bootstrap";

//  This component will work like this:
// 
//  The bare minimum requirement is to get the data of all employees 
//  there are. Given time export should be available for managers as well.
//  1. all the data needed should be retrieved from the database. 
//          This is done by creating a query for all users and a query
//          for all time registrations.
//
//  2. the data should be sorted, or the order in which the data should be written 
//      to the file should be determined.
//          The data retrieved from the previous step should be sorted into a
//          new data structure such that all data is contained nicely. 
// 
//  3. The file needs to be exported to the user. 
//          The data organized in previous step should be written to a filestream 
//          in the csv format. Shouldn't be hard if organized correctly. 

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

interface RecUserModel {
    id?        : number,
    email?     : string,
    firstName? : string,
    lastName?  : string,
    group?     : number
}

interface AllData {
    data: [string, UserData][],
}

interface UserData {
    id: number,
    lastName: string,
    firstName: string,
    projects: [string, ProjectData][],
}

interface ProjectData {
    projectId: number,
    projectName: string
    tasks: [string, TaskData][]
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

class DataExport extends Component<any>{
    userRecData: RecUserData;

    constructor(props:any) {
        super(props);
        this.userRecData = {
            status: -1,
            data: []
        }
    }
    /**
     * 
     * @returns Returns a promise that contains the received user data from the server.
     */
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

    /**
     * Converts the data given to a CSV format and then converts it to bytes, puts the bytes in a blob and downloads it by 
     * simulating a click on the a url.
     * @param convertedData The data that has been converted. Should contain all userdata and timesheet data for all users.
     * @returns void function, but basically converts the data structure to csv and downloads it.
     */
    private downloadCSV(convertedData: AllData): void {
        // Amount of data that can be downloaded should be inhibited by amount of RAM available in the browser window. 
        let csvText: string = this.convertToCSV(convertedData);
        // Convert the string to bytes
        let bytes = new TextEncoder().encode(csvText);

        // Create a blob with the bytes
        let blob = new Blob([bytes], { type: "text/plain" });

        // Create a URL for the blob
        let url = URL.createObjectURL(blob);

        // Create a link element with the URL and download attribute
        let link = document.createElement("a");
        link.href = url;
        link.download = "data.csv";

        // Simulate a click on the link to trigger the download
        link.click();
    }

    /**
     * 
     * @param convertedData The data that has been converted. Should contain all userdata and timesheet data for all users.
     * @returns a string, which is in the CSV format.
     */
    private convertToCSV(convertedData: AllData): string {
        let headerElements = ["Last name", "First name", "Id", "Project", "Id", "Task", "Id", "Total minutes(task)"]
        let delimiter = ';'
        let headerLine = `"${headerElements.join(`"${delimiter}"`)}"`; // Just joins all the elements above with a ";" in between and at the two ends.
        let allText = "" + headerLine;
        for (let i = 0; i < convertedData.data.length; i++) {
            const [lastName, userData]: [string, UserData] = convertedData.data[i];

            for (let j = 0; j < userData.projects.length; j++) {
                const [projectName, projectData]: [string, ProjectData] = userData.projects[j];

                for (let k = 0; k < projectData.tasks.length; k++) {
                    const [taskName, taskData]: [string, TaskData] = projectData.tasks[k];
                    console.log(taskData.totalHours);
                    let varList = [lastName, userData.firstName, userData.id, projectName, projectData.projectId, taskName, taskData.taskId, taskData.totalHours];
                    allText += `\n"${varList.join(`"${delimiter}"`)}"`; // For all tasks we need to create a new line in the csv containing all info. 
                    // Joins the elements the same way the header works.
                }
            }
        }

        return allText;
    }

    /**
     * 
     * @param rawData The exact data received from a call to get all users.
     * @returns a better data structure, containing all user data now. No timesheet data in yet. 
     */
    private convertRawUserData(rawData: RecUserData): AllData {
        let allData: AllData = {
            data: []
        }
        for (let i = 0; i < rawData.data.length; i++) {
            let lastName = rawData.data[i].lastName;
            let firstName = rawData.data[i].firstName;

            if (lastName != null && firstName != null) { 
                let foundRange: [number, number] = [0, 0]; // Explains the range in which these entries exist.
                if (allData.data.length > 0) {
                    foundRange = this.findBinarySearch(allData.data, lastName, 0, allData.data.length - 1);
                }

                // If the start and end of the range is the same, a new element should be here. Meaning binSearch found nothing.
                if (foundRange[0] === foundRange[1]) {
                    // Insert the stuffs into the array. 
                    let userTuple: [string, UserData] = this.createUserTuple(rawData.data[i])

                    allData.data.splice(foundRange[0], 0, userTuple); // Insert the userTuple at correct index. 
                }
                else { // This case happens for users with the same last name. 
                    let persAlreadyExists: boolean = false;
                    // Loop through all existing users in the range found by binary search
                    for (let k = foundRange[1] - 1; foundRange[0] <= k; k--) {
                        let persExisting = allData.data[k];
                        let persToBeInserted = rawData.data[i];
                        if (persToBeInserted.firstName == null) throw new Error("FirstName shouldn't be null");

                        // If the existing user's first name is less than the new user's first name, insert the new user here
                        if (persExisting[1].firstName < persToBeInserted.firstName) {
                            let userTuple: [string, UserData] = this.createUserTuple(persToBeInserted);
                            allData.data.splice(k + 1, 0, userTuple);
                            persAlreadyExists = true;
                            break;
                        }
                        // If the existing user's ID is the same as the new user's ID, the user already exists
                        if (persExisting[1].id === persToBeInserted.id) {
                            persAlreadyExists = true;
                            break;
                        }
                    }
                    // If the user doesn't already exist, insert them at the start of the range found by binary search
                    if (!persAlreadyExists) {
                        allData.data.splice(foundRange[0], 0, this.createUserTuple(rawData.data[i]))
                    }
                }
            }
        }

        return allData;
    }

    /**
     * Creates a tuple containing the user's last name and their user data.
     * @param userModel - the user model to create a tuple for
     * @returns a tuple containing the user's last name and their user data
     * @throws an error if the user's last name is null
     */
    private createUserTuple(userModel: RecUserModel): [string, UserData] {
        if (userModel.lastName == null) throw new Error("Case shouldn't happen.");
        return [
            userModel.lastName,
            this.getUserData(userModel)
        ]
    }

    /**
     * Finds the range of indices in a sorted list where a given value occurs.
     * @param list - the sorted list to search
     * @param searchValue - the value to search for
     * @param start - the starting index of the range to search
     * @param end - the ending index of the range to search
     * @returns a tuple containing the start and end indices of the range where the search value occurs
     */
    private findBinarySearch(list: [string, UserData][], searchValue: string, start: number, end: number): [number, number] {
        let m: number = Math.floor((start + end) / 2);

        // If the middle element is the search value, find the range of indices where the search value occurs
        if (list[m][0] === searchValue) {
            // Find the start index of the range
            let startIndex: number = this.repetitionsInDirection(list, searchValue, m, -1) + m;
            // Find the end index of the range
            let endIndex: number = m + this.repetitionsInDirection(list, searchValue, m - 1, 1);
            return [startIndex, endIndex];
        }
        // If the middle element is less than the search value, search the right half of the list
        else if (list[m][0] < searchValue) {
            // If there are no more elements to search, return the index where the search value should be inserted
            if (end - (m + 1) < 0) return [m + 1, m + 1];
            return this.findBinarySearch(list, searchValue, m + 1, end);
        }
        // If the middle element is greater than the search value, search the left half of the list
        else if (searchValue < list[m][0]) {
            // If there are no more elements to search, return the index where the search value should be inserted
            if (m - 1 - start < 0) return [start, start];
            return this.findBinarySearch(list, searchValue, start, m - 1);
        }

        // This case should never happen
        throw new Error("Something went wrong with binary search. This case shouldn't exist.");
    }


    /**
     * Finds the number of consecutive repetitions of a search value in a given direction in a sorted list.
     * @param list - the sorted list to search
     * @param searchValue - the value to search for
     * @param currentIndex - the current index in the list
     * @param increment - the direction to search in (1 for right, -1 for left)
     * @returns the number of consecutive repetitions of the search value in the given direction
     */
    private repetitionsInDirection(list: [string, UserData][], searchValue: string, currentIndex: number, increment: number): number {
        // If the next element in the given direction is the search value, recursively call the function with the next index in the same direction
        if (list[currentIndex + increment][0] === searchValue) {
            return increment + this.repetitionsInDirection(list, searchValue, currentIndex + increment, increment);
        }
        // If the next element in the given direction is not the search value, return 0
        return 0;
    }


    /**
     * Takes in raw user data and returns a formatted UserData object.
     * @param rawUserData - the raw user data to format
     * @returns the formatted UserData object
     */
    private getUserData(rawUserData: RecUserModel): UserData {
        // Check that the required fields are not null
        if (rawUserData.firstName == null || rawUserData.lastName == null || rawUserData.id == null) {
            throw new Error("Somehow the passed data was null, shouldn't happen.");
        }
        // Create a new UserData object with the formatted data
        return {
            id: rawUserData.id,
            firstName: rawUserData.firstName,
            lastName: rawUserData.lastName,
            projects: []
        }
    }

    /**
     * Retrieves all timesheets for all users in the given data structure.
     * @param convertedData - the data structure containing user data
     * @returns a promise that resolves to the timesheet data
     */
    private async getAllTimesheets(convertedData: AllData): Promise<RecTimesheetData> {
        // Get an array of all user IDs in the data structure
        let userIds: number[] = this.getAllUserIDs(convertedData)
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


    /**
     * Returns an array of all user IDs in the given data structure.
     * @param convertedData - the data structure containing user data
     * @returns an array of user IDs
     */
    private getAllUserIDs(convertedData: AllData): number[] {
        let ids: number[] = [];
        for (let i = 0; i < convertedData.data.length; i++) {
            // Get the tuple containing the user data
            const userTuple: [string, UserData] = convertedData.data[i];
            // Get the user ID from the user data and add it to the array
            ids.push(userTuple[1].id);
        }
        return ids;
    }


    /**
     * Asynchronously retrieves all data needed for the CSV export, converts it to the correct format,
     * populates the data structure with the timesheet data, downloads the CSV file, and logs the data structure.
     */
    private async getAllData() {
        // Get the user data and convert it to the correct format
        let rawUserDataReceived: RecUserData = await this.getAllUsers();
        let convertedData: AllData = this.convertRawUserData(rawUserDataReceived);

        // Get the timesheet data and populate the data structure with it
        let rawTimesheetDataReceived: RecTimesheetData = await this.getAllTimesheets(convertedData);
        this.populateWithTimesheetData(convertedData, rawTimesheetDataReceived);

        // Download the CSV file
        this.downloadCSV(convertedData);
    }

    /**
     * Populates the convertedData data structure with the timesheet data.
     * @param convertedData - the data structure to populate
     * @param rawTimesheetDataReceived - the raw timesheet data received from the API
     */
    private populateWithTimesheetData(convertedData: AllData, rawTimesheetDataReceived: RecTimesheetData) {
        // Loop through each timesheet in the raw data
        for (let i = 0; i < rawTimesheetDataReceived.data.length; i++) {
            // Get the timesheet
            const timesheet: RecTimesheetModel = rawTimesheetDataReceived.data[i];
            // Find the user tuple in the converted data that matches the user ID of the timesheet
            let userTupleMaybe: [string, UserData] | null = this.findEmployeeById(timesheet.userId, convertedData.data);
            // If the user tuple is null, throw an error
            let userTuple: [string, UserData] = this.handleNullUserTuple(userTupleMaybe);
            // Add the timesheet data to the user's project data
            this.addTimesheetDataToUser(userTuple, timesheet);
        }
    }


    /**
     * Adds timesheet data to a user's project data.
     * If the project exists, update the project data.
     * If not, insert it into the array.
     * @param userTuple - the tuple containing the user data
     * @param timesheet - the timesheet data to add
     */
    private addTimesheetDataToUser(userTuple: [string, UserData], timesheet: RecTimesheetModel) {
        // Find the project in the user's project data that matches the project ID of the timesheet
        let [project, indexToInsert]: [ProjectData | null, number] = this.findProject(userTuple[1].projects, timesheet);

        // If no project was found, insert the project at the specified index
        if (project === null) {
            this.insertProjectAtIndex(userTuple[1].projects, timesheet, indexToInsert);
        } 
        // If the project was found, update the project data
        else {
            this.updateProjectData(project, timesheet);
        }
    }

    /**
     * Inserts a new project into the projects array at the specified index.
     * The project data is constructed from the timesheet data.
     * @param projects - the array of projects to insert into
     * @param timesheet - the timesheet data to construct the project data from
     * @param indexToInsert - the index to insert the new project at
     */
    private insertProjectAtIndex(projects: [string, ProjectData][], timesheet: RecTimesheetModel, indexToInsert: number) {
        // Construct the project data from the timesheet data
        const projectData: ProjectData = {
            projectId: timesheet.projectId,
            projectName: timesheet.projectName,
            tasks: [
                [
                    timesheet.taskName,
                    {
                        taskName: timesheet.taskName,
                        taskId: timesheet.taskId,
                        totalHours: timesheet.time,
                        registrations: [
                            {
                                date: timesheet.date,
                                time: timesheet.time
                            }
                        ]
                    }
                ]
            ]
        };
        // Insert the new project into the projects array at the specified index
        projects.splice(indexToInsert, 0, [
            timesheet.projectName,
            projectData
        ]);
    }

    /**
     * Updates the project data with the new timesheet data.
     * If the task exists, update the task data.
     * If not, insert it into the array.
     * @param project - the project data to update
     * @param timesheet - the timesheet data to add
     */
    private updateProjectData(project: ProjectData, timesheet: RecTimesheetModel): void {
        // Find the task in the project's task data that matches the task ID of the timesheet
        let [task, indexToInsert]: [TaskData | null, number] = this.findTask(project.tasks, timesheet);

        // If no task was found, insert the task at the specified index
        if (task === null) {
            this.insertTask(project.tasks, timesheet, indexToInsert);
        } 
        // If the task was found, update the task data
        else {
            this.updateTask(task, timesheet);
        }
    }

    /**
     * Finds the task in the project's task data that matches the task ID of the timesheet.
     * If the task is found, returns the task data and -1 to indicate that no insertion is needed.
     * If the task is not found, returns null and the index where the task should be inserted.
     * @param tasks - the array of tasks to search through
     * @param timesheet - the timesheet data to match with a task
     * @returns a tuple containing the task data (or null) and the index where the task should be inserted
     */
    private findTask(tasks: [string, TaskData][], timesheet: RecTimesheetModel): [TaskData | null, number] {
        for (let i = 0; i < tasks.length; i++) {
            const [taskName, taskData]: [string, TaskData] = tasks[i];

            // Check if the task ID matches the timesheet's task ID
            let hasSameId: boolean = taskData.taskId === timesheet.taskId;
            if (hasSameId) {
                // If it does, return the task data and -1 to indicate that no insertion is needed
                return [taskData, -1];
            }

            // Check if the timesheet's task name is smaller than the current task name
            let nameIsSmaller: boolean = timesheet.taskName < taskName;
            if (nameIsSmaller) {
                // If it is, return null and the index where the task should be inserted
                return [null, i];
            }

            // Check if the task name matches the timesheet's task name
            let hasSameName: boolean = taskName === timesheet.taskName;
            let idIsSmaller = timesheet.taskId < taskData.taskId;
            if (hasSameName && idIsSmaller) {
                // If it does and the timesheet's task ID is smaller than the current task ID, return null and the index where the task should be inserted
                return [null, i]
            }
        }
        // If no match was found, return null and the index where the task should be inserted (at the end of the array)
        return [null, tasks.length];
    }

    
    /**
     * Updates the task data with the new timesheet data.
     * Adds the time from the timesheet to the task's total hours and adds a new registration to the task's registrations array.
     * @param task - the task data to update
     * @param timesheet - the timesheet data to add to the task
     */
    private updateTask(task: TaskData, timesheet: RecTimesheetModel) {
        task.totalHours += timesheet.time; // Add the time from the timesheet to the task's total hours
        task.registrations.push({ // Add a new registration to the task's registrations array
            date: timesheet.date,
            time: timesheet.time,
        })
    }

    
    /**
     * Inserts a new task into the tasks array at the specified index.
     * The task data is created from the timesheet data.
     * @param tasks - the array of tasks to insert into
     * @param timesheet - the timesheet data to create the new task from
     * @param indexToInsert - the index where the new task should be inserted
     */
    private insertTask(tasks: [string, TaskData][], timesheet: RecTimesheetModel, indexToInsert: number) {
        // Create a new task object from the timesheet data
        const newTask: TaskData = {
            taskId: timesheet.taskId,
            taskName: timesheet.taskName,
            totalHours: 0,
            registrations: [{
                date: timesheet.date,
                time: timesheet.time
            }]
        };
        // Insert the new task into the tasks array at the specified index
        tasks.splice(indexToInsert, 0, [timesheet.taskName, newTask]);
    }

    /**
     * Finds the project in the projects array that corresponds to the given timesheet.
     * If the project is found, returns a tuple with the project data and -1 to indicate that it already exists.
     * If the project is not found, returns a tuple with null and the index where the project should be inserted.
     * @param projects - the array of projects to search through
     * @param timesheet - the timesheet data to find the corresponding project for
     * @returns a tuple with the project data and either -1 or the index where the project should be inserted
     */
    private findProject(projects: [string, ProjectData][], timesheet: RecTimesheetModel): [ProjectData | null, number] {
        // Loop through all the projects in the array
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];

            // Check if the project ID matches the timesheet's project ID
            let hasSameId: boolean = project[1].projectId === timesheet.projectId;
            if (hasSameId) {
                // If it does, return the project data and -1 to indicate that it already exists
                return [project[1], -1];
            }

            // Check if the timesheet's project name is smaller than the current project name
            let nameIsSmaller: boolean = timesheet.projectName < project[0];
            if (nameIsSmaller) {
                // If it is, return null and the index where the project should be inserted
                return [null, i];
            }

            // Check if the project name matches the timesheet's project name and the timesheet's project ID is smaller than the current project ID
            let hasSameName: boolean = project[0] === timesheet.projectName;
            let idIsSmaller: boolean = timesheet.projectId < project[1].projectId;
            if (hasSameName && idIsSmaller) {
                // If it does, return null and the index where the project should be inserted
                return [null, i];
            }

            // If the current project name is smaller than the timesheet's project name, continue to the next project in the array
        }

        // If no match was found, return null and the index where the project should be inserted (at the end of the array)
        return [null, projects.length];
    }


    /**
     * If the userTuple is null, throw an error. Otherwise, return the userTuple.
     * @param userTuple - the tuple containing the user data
     * @returns the userTuple if it is not null
     * @throws an error if the userTuple is null
     */
    private handleNullUserTuple(userTuple: [string, UserData] | null): [string, UserData] {
        if (userTuple === null) throw new Error("Didn't find employee for timesheet.");
        return userTuple;
    }


    /**
     * Finds the employee in the userTuples array that corresponds to the given id.
     * If the employee is found, returns the tuple with the employee data.
     * If the employee is not found, returns null.
     * @param id - the id of the employee to find
     * @param userTuples - the array of user tuples to search through
     * @returns the tuple with the employee data if found, otherwise null
     */
    private findEmployeeById(id: number, userTuples: [string, UserData][]): [string, UserData] | null {
        // Loop through all the user tuples in the array
        for (let k = 0; k < userTuples.length; k++) {
            const userTuple: [string, UserData] = userTuples[k];
            // Check if the id matches the user's id
            if (id === userTuple[1].id) {
                // If it does, return the user tuple
                return userTuple;
            }
        }
        // If no match was found, return null
        return null;
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