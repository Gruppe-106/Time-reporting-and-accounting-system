import React, { Component } from "react";
import {Button, ButtonGroup, Container, Dropdown, Stack, Table} from "react-bootstrap";
import BaseNavBar from "../../components/navBar";
import BaseApiHandler from "../../network/baseApiHandler";
import { userInfo } from "../../utility/router";
import { getDayThisWeek, getIndexOfWeek } from "../../utility/timeConverter";
import TimeInput, {AnonValue} from "../timeRegister/timeInput";
import {Highlighter, Typeahead} from "react-bootstrap-typeahead";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faPlus} from "@fortawesome/free-solid-svg-icons";

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

class TimeRegister extends Component<any> 
{
    tasksRegistrations: Map<number, TaskRegistration> = new Map<number, TaskRegistration>();
    tasks: Task[] = [];
    weekOffset: number = 0;
    readonly weekDays: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    addSelectedTaskValue: Task | undefined;

    componentDidMount() 
    {
        let handler = this.getRegistrationData();

        handler.get(`/api/user/task/project/get?user=${userInfo.userId}`, {}, (value) => {
            let recData: TaskApi = JSON.parse(JSON.stringify(value));
            if (recData.status !== 200) {
                alert("Tasks couldn't be retrieved");
                return;
            }
            this.tasks = recData.data;
        })
    }

    private getRegistrationData() {
        let handler: BaseApiHandler = new BaseApiHandler();
        let period: [number, number] = this.getPeriod(this.weekOffset);
        handler.get(`/api/time/register/get?user=${userInfo.userId}&period=${period[0]},${period[1]}`, {}, (value) => {
            console.log(value);
            let recData: ApiResponse = JSON.parse(JSON.stringify(value));
            if (recData.status !== 200) {
                alert("Server didn't respond correctly...");
                return;
            }
            this.tasksRegistrations = new Map<number, TaskRegistration>();
            let timesheetData: TimesheetRecData[] = recData.data;
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
        return handler;
    }

    getPeriod(weekOffset: number): [number, number]
    {
        return [getDayThisWeek(0, weekOffset), getDayThisWeek(0, weekOffset + 1) - 1];
    }

    tableRender(): JSX.Element 
    {
        //if (this.timesheetData.length <= 0) return (<></>);
        
        return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Task</th>
                        {this.weekDays.map((day, key) => (<th key={key}>{day}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from(this.tasksRegistrations.keys()).map((taskKey, key) => (
                        <tr key={key}>
                            <td>{this.tasksRegistrations.get(taskKey)?.projectName}</td>
                            <td>{this.tasksRegistrations.get(taskKey)?.taskName}</td>
                            {[0,1,2,3,4,5,6].map((dayIndex, key) => (
                                <td key={key}>{
                                    this.inputRender(taskKey, dayIndex)
                                }</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
        )
    }

    private onInputBlur(taskKey: number, dayIndex: number, value: AnonValue) {
        let task: TaskRegistration | undefined = this.tasksRegistrations.get(taskKey);
        if (task !== undefined) {
            let registration: TimeRegistration = task.registrations.get(dayIndex) ?? {
                approved: false,
                managerLogged: false,
                hours: 0,
                minutes: 0,
                fromServer: false
            };

            registration.minutes = value.minutes;
            registration.hours = value.hours;

            task.registrations.set(dayIndex, registration);
            this.tasksRegistrations.set(taskKey, task);

            let apiHandler = new BaseApiHandler();
            // This do be cursed
            let sundayOffset = 0;
            let weekDay = dayIndex + 1
            if (weekDay > 6) {
                weekDay = 0;
                sundayOffset = 1;
            }
            // Thank you for coming to my ted talk
            if ( registration.fromServer ) {
                let body: RegisterPut = {
                    date: getDayThisWeek(weekDay, this.weekOffset + sundayOffset),
                    time: value.hours * 60 + value.minutes,
                    taskId: taskKey,
                    managerLogged: false,
                    userId: userInfo.userId
                }
                console.log("put", body, weekDay);
                apiHandler.put("/api/time/register/edit/put", {body: body}, (value) => {
                    console.log(value);
                });
            } else {
                let body: RegisterPost = {
                    date: getDayThisWeek(weekDay, this.weekOffset + sundayOffset),
                    time: value.hours * 60 + value.minutes,
                    taskId: taskKey,
                    userId: userInfo.userId
                }
                console.log("post", body, weekDay);
                apiHandler.post("/api/time/register/post", {body: body}, (value) => {
                    console.log(value);
                });
            }
        }
    }

    private inputRender(taskKey: number, dayIndex: number): JSX.Element {
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
        return (
            <TimeInput defaultValue={data.time} managerLogged={data.managerLogged} approved={data.approved} enableDropDown={true}
            onBlur={(value) => {this.onInputBlur(taskKey, dayIndex, value)}}/>
        );
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
                    </Stack>
                </Container>
            </>
        )
    }

}

export default TimeRegister;