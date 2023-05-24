import React, {Component} from "react";
import {Button, ButtonGroup, Container, Form, Stack, Table} from "react-bootstrap";
import BaseNavBar from "../../components/navBar";
import BaseApiHandler from "../../network/baseApiHandler";
import {userInfo} from "../../utility/router";
import {getDayThisWeek, getIndexOfWeek} from "../../utility/timeConverter";
import TimeInput, {AnonValue} from "../timeRegister/timeInput";
import {Highlighter, Typeahead} from "react-bootstrap-typeahead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faPlus} from "@fortawesome/free-solid-svg-icons";
import {UserAPI, UserData} from "../timeRegister/components/interfaces";

interface ApiResponse 
{
    status: number,
    data: TimesheetRecData[],
}

interface TimesheetRecData 
{
    taskId: number,
    taskName: string,
    projectName: string,
    date: number,
    time: number,
    approved: boolean,
    managerLogged: boolean,
}

interface TaskRegistration 
{
    taskName: string,
    projectName: string,
    registrations: Map<number, TimeRegistration>
}

interface TimeRegistration 
{
    approved: boolean,
    managerLogged: boolean,
    minutes: number,
    hours: number,
    fromServer: boolean,
}

interface TaskApi   {
    status: number,
    data: Task[]
}

interface Task {
    projectName: string,
    projectId: number,
    taskName: string,
    taskId: number
}

interface RegisterPut {
    date          : number,
    taskId        : number,
    userId        : number,
    time          : number,
    managerLogged : boolean
}

interface RegisterPost {
    date   : number,
    taskId : number,
    userId : number,
    time   : number,
}

interface RegisterApiResponse {
    status: number,
    data: {
        success? : boolean,
        error?   : string,
        message? : string[],
        reason?  : string[]
    }
}

class TimeRegister extends Component<any> 
{
    tasksRegistrations: Map<number, TaskRegistration> = new Map<number, TaskRegistration>();
    tasks: Task[] = [];
    weekOffset: number = 0;
    readonly weekDays: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    addSelectedTaskValue: Task | undefined;
    userId: number = userInfo.userId;
    users: UserData[] = [];

    componentDidMount() 
    {
        let handler = this.getRegistrationData();
        this.getUserData(handler);
        handler.get(`/api/user/task/project/get?user=${this.userId}`, {}, (value) => {
            let recData: TaskApi = JSON.parse(JSON.stringify(value));
            if (recData.status !== 200) {
                alert("Tasks couldn't be retrieved");
                return;
            }
            this.tasks = recData.data;
            this.forceUpdate();
        })
    }

    private getUserData(apiHandler: BaseApiHandler) {
        apiHandler.get(
            `/api/user/get?ids=*&var=id,firstName,lastName`, {},
            (value) => {
                // Parse the response JSON
                let json: UserAPI = JSON.parse(JSON.stringify(value));
                // If the API call was successful (status code 200), update the state with the fetched data
                if (json.status === 200) {
                    this.users = json.data;
                }
                this.forceUpdate();
            }
        );
    }

    private getRegistrationData() {
        let handler: BaseApiHandler = new BaseApiHandler();
        let period: [number, number] = this.getPeriod(this.weekOffset);
        handler.get(`/api/time/register/get?user=${this.userId}&period=${period[0]},${period[1]}`, {}, async (value) => {
            console.log(value);
            let recData: ApiResponse = JSON.parse(JSON.stringify(value));
            if (recData.status !== 200) {
                alert("Server didn't respond correctly...");
                return;
            }
            this.tasksRegistrations.clear();
            let timesheetData: TimesheetRecData[] = recData.data;
            this.forceUpdate(() => {
                for (let index = 0; index < timesheetData.length; index++) {
                    let registration: TimeRegistration = {
                        approved: timesheetData[index].approved,
                        managerLogged: timesheetData[index].managerLogged,
                        hours: Math.floor(timesheetData[index].time / 60),
                        minutes: timesheetData[index].time % 60,
                        fromServer: true
                    }
                    if (this.tasksRegistrations.has(timesheetData[index].taskId)) {
                        let task = this.tasksRegistrations.get(timesheetData[index].taskId);
                        task?.registrations.set(getIndexOfWeek(timesheetData[index].date), registration);
                        if (!task) continue;
                        this.tasksRegistrations.set(timesheetData[index].taskId, task);
                        continue;
                    }
                    let registrationMap = new Map<number, TimeRegistration>();
                    registrationMap.set(getIndexOfWeek(timesheetData[index].date), registration);
                    this.tasksRegistrations.set(timesheetData[index].taskId, {
                        projectName: timesheetData[index].projectName,
                        registrations: registrationMap,
                        taskName: timesheetData[index].taskName,
                    })
                }
                this.forceUpdate();
            })
        })
        return handler;
    }

    getPeriod(weekOffset: number): [number, number]
    {
        return [getDayThisWeek(0, weekOffset), getDayThisWeek(0, weekOffset + 1) - 1];
    }

    private registrationRowRender(taskKey: number, key: number) {
        let inputElements: JSX.Element[] = [];
        let totalTime: number = 0;
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            let inputRender: [number, JSX.Element] = this.inputRender(taskKey, dayIndex);
            inputElements.push(
                <td key={dayIndex}>
                    { inputRender[1] }
                </td>
            )
            totalTime += inputRender[0];
        }
        return (
            <tr key={key}>
                <td>{this.tasksRegistrations.get(taskKey)?.projectName}</td>
                <td>{this.tasksRegistrations.get(taskKey)?.taskName}</td>
                {inputElements}
                <td>
                    <TimeInput key={totalTime}
                               defaultValue={totalTime}
                               managerLogged={true}
                               approved={true}
                               backgroundColor={"#5798F9"}
                    />
                </td>
            </tr>
        )
    }

    tableRender(): JSX.Element 
    {
        return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Task</th>
                        {this.weekDays.map((day, key) => (<th key={key}>{day}</th>))}
                        <th>Total time</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(this.tasksRegistrations.keys()).map((taskKey, key) => (
                        this.registrationRowRender(taskKey, key)
                    ))}
                </tbody>
            </Table>
        </>
        )
    }

    private async onInputBlur(taskKey: number, dayIndex: number, value: AnonValue) {
        let task: TaskRegistration | undefined = this.tasksRegistrations.get(taskKey);
        if (task !== undefined) {
            let registration: TimeRegistration = task.registrations.get(dayIndex) ?? {
                approved: false,
                managerLogged: false,
                hours: 0,
                minutes: 0,
                fromServer: false
            };

            let apiHandler = new BaseApiHandler();

            let sundayOffset = 0;
            let weekDay = dayIndex + 1
            if (weekDay > 6) {
                weekDay = 0;
                sundayOffset = 1;
            }

            new Promise((resolve) => {
                let apiCallback = (response: object) => {
                    let res: RegisterApiResponse = JSON.parse(JSON.stringify(response));
                    if (res.status !== 200) {
                        alert("Outside task period");
                        resolve(false);
                    }
                    resolve(true);
                }

                if ( registration.fromServer ) {
                    let body: RegisterPut = {
                        date: getDayThisWeek(weekDay, this.weekOffset + sundayOffset),
                        time: value.hours * 60 + value.minutes,
                        taskId: taskKey,
                        managerLogged: false,
                        userId: this.userId
                    }
                    apiHandler.put("/api/time/register/edit/put", {body: body}, apiCallback);
                } else {
                    let body: RegisterPost = {
                        date: getDayThisWeek(weekDay, this.weekOffset + sundayOffset),
                        time: value.hours * 60 + value.minutes,
                        taskId: taskKey,
                        userId: this.userId
                    }
                    apiHandler.post("/api/time/register/post", {body: body}, apiCallback);
                }
            }).then((success) => {
                if (success) {
                    registration.minutes = value.minutes;
                    registration.hours   = value.hours;
                } else {
                    registration.minutes = 0;
                    registration.hours   = 0;
                }
                if (task !== undefined) {
                    task.registrations.set(dayIndex, registration);
                    this.tasksRegistrations.set(taskKey, task);
                    this.forceUpdate();
                }
            });
        }
    }

    private inputRender(taskKey: number, dayIndex: number): [number, JSX.Element] {
        let registration = this.tasksRegistrations.get(taskKey)?.registrations.get(dayIndex);
        let data = {
            time: 0,
            approved: false,
            managerLogged: false
        }
        if (registration !== undefined) {
            data = {
                time: registration.minutes  + registration.hours * 60,
                managerLogged: registration.managerLogged,
                approved: registration.approved
            }
        }

        return [data.time, (
            <TimeInput key={Date.now()} defaultValue={data.time} managerLogged={data.managerLogged} approved={data.approved} enableDropDown={true}
            onBlur={(value) => {this.onInputBlur(taskKey, dayIndex, value)}}/>
        )];
    }

    private taskTypeahead() {
        return <Typeahead
            id="assignManager"
            labelKey={(option: any) => `${option.taskName}  ${option.taskId}`}
            options={this.tasks.filter((value) => {
                return !this.tasksRegistrations.has(value.taskId);
            })}
            placeholder="Choose Task..."
            onChange={(selected: any) => {
                this.addSelectedTaskValue = selected[0];
            }}
            filterBy={(option: any, props: any): boolean => {
                const query: string = props.text.toLowerCase().trim();
                const name: string = (option.taskName).toLowerCase().trim();
                const id: string = option.taskId.toString();
                const project: string = option.projectName.toString().toLowerCase().trim();
                return name.includes(query) || id.includes(query) || project.includes(query);
            }}
            renderMenuItemChildren={(option: any, props: any) => (
                <>
                    <Highlighter search={props.text}>
                        {option.taskName + " - " + option.taskId}
                    </Highlighter>
                    <div>
                        <small>Project: {option.projectName}</small>
                    </div>
                </>
            )}
        />;
    }

    private addTaskToTable(): void {
        if (this.addSelectedTaskValue === undefined) return;
        if (!this.tasksRegistrations.has(this.addSelectedTaskValue.taskId)) {
            let task: TaskRegistration = {
                taskName: this.addSelectedTaskValue.taskName,
                projectName: this.addSelectedTaskValue.projectName,
                registrations: new Map<number, TimeRegistration>()
            }
            this.tasksRegistrations.set(this.addSelectedTaskValue.taskId, task);
            this.forceUpdate();
        }
    }

    private changeWeek(num: number) {
        this.weekOffset = this.weekOffset + num;
        this.getRegistrationData();
    }

    private weekSelectorRender(): JSX.Element {
        let monday: number;
        let sundayBeforeMidnight: number;
        [monday, sundayBeforeMidnight] = this.getPeriod(this.weekOffset);
        return (
            <center className='py-3'>
                <b>{new Date(monday).toDateString()} - {new Date(sundayBeforeMidnight).toDateString()}</b>
                <div className='py-3'>
                    <ButtonGroup aria-label="Basic example">
                        <Button onClick={() => {this.changeWeek(-1)}} variant="primary"><FontAwesomeIcon icon={faArrowLeft} /></Button>
                        <Button onClick={() => {this.changeWeek(1)}} variant="primary"><FontAwesomeIcon icon={faArrowRight}/></Button>
                    </ButtonGroup>
                </div>
            </center>
        )
    }

    private handleSelectChange(value: React.ChangeEvent<HTMLSelectElement>) {
        let id: number = parseInt(value.target.value);
        this.userId = id;
        this.getRegistrationData();
    }

    render()
    {
        return (
            <>
                <BaseNavBar/>
                <Container className="pt-3">
                    <h1>Time Registration</h1>
                    {this.weekSelectorRender()}
                    {this.tableRender()}
                    <Stack direction={"horizontal"} gap={3}>
                        {this.taskTypeahead()}
                        <Button onClick={() => this.addTaskToTable()}><FontAwesomeIcon icon={faPlus} /></Button>
                        { userInfo.isAdmin ? (<Form.Select onChange={(e) => this.handleSelectChange(e)}>
                            <option key={0}>Select user</option>
                            {this.users.map((item) => {
                                return (
                                    <option key={item.id} value={item.id}>{item.firstName} {item.lastName}, {item.id}</option>
                                );
                            })}
                        </Form.Select>) : null}
                    </Stack>
                </Container>
            </>
        )
    }
}

export default TimeRegister;