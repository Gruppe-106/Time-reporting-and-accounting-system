import React, {Component} from "react";
import {userInfo} from "../../utility/router";
import {Accordion, Container, Stack, Table} from "react-bootstrap";
import {getCurrentWeekDates, getDayThisWeek} from "../../utility/timeConverter";
import BaseApiHandler from "../../network/baseApiHandler";
import {Api, TaskRowData} from "./components/interfaces";
import TimeInput from "./timeInput";

// Variable states in TimeSheetPage
export interface TimeSheetState {
    taskData: Map<number, TaskRowData>;
    weekOffset: number;
    mobile: boolean;
}


class RegisterTable extends Component<any, TimeSheetState>{
    private userId: number;

    state = {
        taskData: new Map<number, TaskRowData>,
        weekOffset: 0,
        mobile: false
    }

    constructor(props: any) {
        super(props);
        this.userId = userInfo.userId;
        if (window.innerWidth <= 992) this.state.mobile = true;
        window.addEventListener("resize", () => {
            let width = window.innerWidth;
            if (width > 992) this.setState({mobile: false});
            else this.setState({mobile: true});
        });
    }

    componentDidMount() {
        this.getData();
    }

    private getData() {
        // Gets the dates for the week
        let timeSheetDate: string[] = getCurrentWeekDates(undefined, this.state.weekOffset);

        // Make the API call to retrieve the user's task data for the current week.
        let apiHandler = new BaseApiHandler();
        apiHandler.get(
            `/api/time/register/get?user=${this.userId}&period=${Date.parse(timeSheetDate[0])},${Date.parse(timeSheetDate[6])}&var=taskName,taskId,time,date,approved,managerLogged,userId`, {},
            (value) => {
                // Parse the API response into JSON format.
                let json: Api = JSON.parse(JSON.stringify(value));
                // Create a new Map object to hold the user's task data.
                let taskData: Map<number, TaskRowData> = new Map<number, TaskRowData>();
                // If the API call was successful (status code 200), process the data.
                if (json.status === 200) {
                    for (const task of json.data) {
                        if (taskData.has(task.taskId)) {
                            // If the task data is already in the Map, update the objectData array.
                            let data = taskData.get(task.taskId);
                            if (data) {
                                data?.objectData.push({ date: task.date, time: task.time, approved: task.approved, managerLogged: task.managerLogged });
                                taskData.set(task.taskId, data);
                            }
                        } else {
                            // If the task data is not in the Map, add it with a new objectData array.
                            taskData.set(task.taskId, { projectName: task.projectName ?? "", taskName: task.taskName ?? "", taskId: task.taskId, objectData: [{ date: task.date, time: task.time, approved: task.approved, managerLogged: task.managerLogged }] })
                        }
                    }
                    this.setState({ taskData: taskData })
                }
            }
        );
    }

    compareDates(date1: number, date2: number): boolean {
        return new Date(date1).getDay() === new Date(date2).getDay();
    }

    getCurrentDateData(data: TaskRowData, day: number) {
        for (const value of data.objectData) {
            if (this.compareDates(getDayThisWeek(day, this.state.weekOffset), value.date)) {
                return value;
            }
        }
        return undefined;
    }

    getMinutesAsHour(time: number = 0) {
        let hours: number = Math.floor(time / 60);
        let minutes: number = time % 60;
        return [hours, minutes];
    }

    inputOnlyNumbers(event: any) {
        if (!/[0-9.]/.test(event.key)) {
            event.preventDefault();
        }
    }

    convertToClosestIntervalOf15(event: any): void {
        let values: string[] = event.target.value.split(":");
        let hours:number = Number.parseInt(values[0]);
        let minutes: number = Number.parseInt(values[1]);
        minutes = Math.round(minutes / 15) * 15;
        event.target.value = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "00" : minutes}`;
    }

    createTimeInputRender(data: TaskRowData) {
        let columns: JSX.Element[] = [];

        for (let i = 0; i < 7; i++) {
            let dateData = this.getCurrentDateData(data, i);

            let time = this.getMinutesAsHour(dateData?.time);
            let defaultValue = `${time[0] < 10 ? "0" + time[0] : time[0]}:${time[1] < 10 ? "00" : time[1]}`;
            let approved = false;

            if (dateData !== undefined && dateData.managerLogged && dateData.managerLogged) {
                approved = true;
            }
            columns.push((
                <td>
                    <TimeInput approved={dateData?.approved} managerLogged={dateData?.managerLogged} defaultValue={dateData?.time}/>
                </td>
            ))
        }

        return columns;
    }

    timeRegisterRowRender(): JSX.Element[] {
        let rows: JSX.Element[] = [];
        let width = window.outerWidth;
        for (let entry of Array.from(this.state.taskData)) {
            if (!this.state.mobile) {
                rows.push((
                    <tr>
                        <td>{entry[1].projectName}</td>
                        <td>{entry[1].taskName}</td>
                        {this.createTimeInputRender(entry[1])}
                    </tr>
                ))
            } else {
                rows.push(this.mobileRender(entry));
            }
        }

        return rows;
    }

    private mobileRender(entry: [number, TaskRowData]) {
        let timeRows = this.createTimeInputRender(entry[1]);
        return (
            <Stack direction={"vertical"}>
                <Accordion>
                    <Accordion.Header>
                        <td>{entry[1].projectName} - {entry[1].taskName}</td>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Table>
                            <thead>
                            <tr>
                                <td>Date</td>
                                <td>Time</td>
                            </tr>
                            </thead>
                            <tbody>
                            {getCurrentWeekDates().map((value, key) => {
                                    return (
                                        <tr>
                                            <td>
                                                <h4>{value}</h4>
                                            </td>
                                            {timeRows[key]}
                                        </tr>
                                    )
                                }
                            )}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion>
            </Stack>
        );
    }

    render() {
        return (
            <Container>
                <Table>
                    <thead>
                        <tr className="p-3 mb-2 bg-dark text-white d-none d-lg-table-row" >
                            <td>Project</td>
                            <td>Task</td>
                            { getCurrentWeekDates().map((value, key) => {return (<td key={key}>{value}</td>);}) }
                        </tr>
                    </thead>
                    <tbody>
                        {this.timeRegisterRowRender()}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default RegisterTable;