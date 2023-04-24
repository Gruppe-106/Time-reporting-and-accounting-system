import React, {Component} from 'react'
import {faArrowLeft, faArrowRight, faCheck, faX} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button, ButtonGroup, Table} from 'react-bootstrap'
import BaseApiHandler from '../../network/baseApiHandler';
import {getDayThisWeek} from '../../utility/timeConverter';

interface TimesheetRecData {
    status: number,
    data: Timesheet[]
}

interface Timesheet {
    taskId: number,
    taskName: string,
    projectName: string,
    projectId?: number
    date: number,
    userId?: number,
    time: number,
    approved: boolean,
    managerLogged: boolean
}

interface Employee {
    firstName: string;
    lastName: string;
    id: number;
}

interface ParsedDay {
    time: number,
    approved: boolean,
    managerLogged: boolean    
    date: number,
}

interface ParsedTask {
    taskId: number;
    taskName: string;
    projectName: string;
    days: ParsedDay[];
}

interface Task {
    taskId: number,
    taskName: string,
    projectName: string,
    date: number,
    time: number,
    approved: boolean,
    managerLogged: boolean
}

interface TimesheetPropTypes {
    selectedEmployee: Employee;
    tasks: Task[];
    weekOffset: number;
    tasksParsed: ParsedTask[];
}

class TimesheetTable extends Component<any, TimesheetPropTypes> {
    prevEmployeeId: number;
    state = {
        selectedEmployee: 
        {
            firstName: "",
            lastName: "",
            id: -1
        },
        tasks: [
            {
                taskId: -1,
                taskName: "",
                projectName: "",
                date: -1,
                time: -1,
                approved: false,
                managerLogged: false
            },
        ],
        weekOffset: 0, 
        tasksParsed: [
            {
                taskId: 0,
                taskName: "",
                projectName: "",
                days: [
                    {
                        time: 0,
                        approved: false,
                        managerLogged: false,    
                        date: 0,
                    }
                ]
            }
        ],
    }

    constructor(props: any) {
        super(props);
        // All state variables default values.
        this.state.tasks = [];
        this.state.weekOffset = 0;
        this.state.tasksParsed = []
        
        // Used to check against the state employeeId to determine when to update. 
        this.prevEmployeeId = -1;
    }

    private dateDayIndexToDayIndex(index:number): number {
        return ((index - 1) + 7) % 7
    }

    private dateNumberToDayIndex(date: number): number {
        return this.dateDayIndexToDayIndex(new Date(date).getDay());
    }

    private taskDataToParsedDay(data: Task): ParsedDay {
        return {
            time: data.time,
            approved: data.approved,
            date: data.date,
            managerLogged: data.managerLogged
        };
    }

    private taskDataToParsedTask(data: Task): ParsedTask {
        let pTask: ParsedTask = {
            projectName: data.projectName,
            taskId: data.taskId,
            taskName: data.taskName,
            days: []
        };

        // Undefined day
        let day_undef: ParsedDay = {
            time: 0,
            date: 0,
            approved: false,
            managerLogged: false,
        }

        // Defined day from data.
        let day_def: ParsedDay = this.taskDataToParsedDay(data);

        // Initialize all days to something undefined. 
        [0, 1, 2, 3, 4, 5, 6].forEach(day => {
            pTask.days[day] = day_undef
        });

        // Initialize the day of this time registration
        pTask.days[this.dateNumberToDayIndex(data.date)] = day_def;

        return pTask;
    }

    private getTimesheetData(from: number, to: number) {
        if (this.state.selectedEmployee.id == -1) return;
        let api:BaseApiHandler = new BaseApiHandler();
        let variables: string = 'var=taskId,taskName,projectName,date,time,approved,managerLogged';
        let request: string = `/api/time/register/get?user=${this.state.selectedEmployee.id}&period=${from},${to}&` + variables;
        api.get(request, {},(apiData) => {
            let recData: TimesheetRecData = JSON.parse(JSON.stringify(apiData));

            let tasksParsed: ParsedTask[] = []
            // We need to parse the data now!
            for (let i = 0; i < recData.data.length; i++) {
                let data_task: Task = recData.data[i];
                
                // Look if there is an identical task already.
                let found_i: number = -1;
                for (let k = 0; k < tasksParsed.length; k++) {
                    let element: ParsedTask = tasksParsed[k];
                    if (element.taskId === data_task.taskId) {
                        found_i = k;
                        break;
                    }
                }

                if (found_i < 0) { // An object wasn't found.
                    tasksParsed.push(this.taskDataToParsedTask(data_task))
                } else {
                    tasksParsed[found_i].days[this.dateNumberToDayIndex(data_task.date)] =
                        this.taskDataToParsedDay(data_task);
                }
            }
            
            this.setState({tasks: recData.data, tasksParsed: tasksParsed});
        })
    }

    private toAndFrom(): [number, number] {
        let monday: number = getDayThisWeek(0, this.state.weekOffset)
        let mondayNextWeek: number = getDayThisWeek(0, this.state.weekOffset + 1);
        let sundayBeforeMidnight: number = mondayNextWeek - 1;
        return [monday, sundayBeforeMidnight];
    }

    private weekSelectorRender(): JSX.Element {
        let monday: number;
        let sundayBeforeMidnight: number;
        [monday, sundayBeforeMidnight] = this.toAndFrom();
        return (
            <center className='py-3'>
                <b>{new Date(monday).toDateString()} - {new Date(sundayBeforeMidnight).toDateString()}</b>
                <div className='py-3'>
                    <ButtonGroup aria-label="Basic example">
                        <Button onClick={() => {this.changeWeek(-1)}} variant="primary"><FontAwesomeIcon icon={faArrowLeft} /></Button>
                        <Button onClick={() => {this.changeWeek(1)}} variant="primary"><FontAwesomeIcon icon={faArrowRight}/></Button>
                    </ButtonGroup>
                </div>
                <b>Displaying timesheet of {this.state.selectedEmployee.firstName} {this.state.selectedEmployee.lastName}</b>
            </center>
        )
    }

    private acceptTimesheet(appr: boolean, task: ParsedTask, day: number) {
        // This should approve or disprove a timesheet.
        
        // Steps:
        // Change the data from parsedTask to the data needed to be sent in body of POST
        let body = this.parsedTaskToPostBody(task, day, this.state.selectedEmployee.id, appr);

        // Send the data
        let api:BaseApiHandler = new BaseApiHandler();
        let urlPath: string = "/api/time/register/edit/put"
        api.put(urlPath, {body: body}, (resp) => {
            let jsResp = JSON.parse(JSON.stringify(resp));

            // Maybe do something if it doesn't return successfully.
            // Update the buttons, so they will be disabled accordingly.
            if (jsResp.data.success) {
                let [to, from]: [number, number] = this.toAndFrom();
                this.getTimesheetData(to, from);
            } else {
                alert("Something went wrong with the submission.")
            }
        })
        
         
    }

    private parsedTaskToPostBody(task: ParsedTask, day: number, userId: number, appr: boolean) {
        return {
            taskId: task.taskId,
            date: task.days[day].date,
            userId: userId,
            approved: appr,
            managerLogged: true,
        }
    }

    private changeWeek(num: number) {
        this.state.weekOffset = this.state.weekOffset + num;
        let [to, from]: [number, number] = this.toAndFrom();
        this.getTimesheetData(to, from);
    }

    render() {
        if (this.state.selectedEmployee.id == -1) return null;
        if (this.prevEmployeeId != this.state.selectedEmployee.id) {
            this.prevEmployeeId = this.state.selectedEmployee.id;
            let [to, from]: [number, number] = this.toAndFrom()
            this.getTimesheetData(to, from);
        }
        return (
            <>
                {this.weekSelectorRender()}
                {this.state.selectedEmployee.id !== -1?(
                    <Table className='table-bordered' hover>
                        <thead className="table-dark">
                            <tr className='row'>
                                <th className='col-sm-1'>Project</th>
                                <th className='col-sm-1'>Task</th>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, key) => (
                                    <th className='col-sm' key={key}>{day}</th> 
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tasksParsed.map((pt, key) => (
                                <tr className='row' key={key}>
                                    <td className='col-sm-1'>{pt.projectName}</td>
                                    <td className='col-sm-1'>{pt.taskName}</td>
                                    {[0, 1, 2, 3, 4, 5, 6].map((day, key) => (
                                        <>
                                            <td className='col-sm' key={key}>
                                                {pt.days[day].time > 0?(
                                                        <>
                                                            <span className='row px-3'>Hours: {Math.floor(pt.days[day].time / 60)}:{pt.days[day].time % 60 === 0? "00" : pt.days[day].time % 60}</span>
                                                            <span className='row px-3'><Button className='m-1' disabled={pt.days[day].managerLogged && pt.days[day].approved} variant="success" onClick={() => this.acceptTimesheet(true, pt, day)}><FontAwesomeIcon icon={faCheck} /></Button> <Button className='m-1' disabled={pt.days[day].managerLogged} variant="danger" onClick={() => this.acceptTimesheet(false, pt, day)}><FontAwesomeIcon icon={faX} /></Button></span>
                                                        </>
                                                ):(
                                                    <></>
                                                )}
                                            </td>
                                        </>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ):null}
            </>
        )  
    }
}

export default TimesheetTable 