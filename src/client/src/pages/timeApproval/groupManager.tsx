/*
    Show all users that a group leader resides over
 */

import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, ButtonGroup, Container, Table} from "react-bootstrap";
import BaseApiHandler from "../../network/baseApiHandler";
import {userInfo} from '../../utility/router'
import EmployeeTable from "./employeeTable";


interface TSRecData {
    taskId: number;
    taskName: string;
    projectName: string;
    projectId: number;
    date: number;
    userId: number;
    time: number;
    approved: boolean;
    managerLogged: boolean;
}

interface TSData {
    empLastName: string;
    empFirstName: string;
    tasks: TSTaskData[];
}

interface TSTaskData {
    taskId: number;
    projectName: string;
    projectId: number;
    taskName: string;
    userId: number;
    [key: number]: TSDateRegistration;
}

interface TSDateRegistration {
    time: number;
    managerLogged: boolean;
    approved: boolean;
    date: number;
}

interface EmpRecData {
    manager: number,
    firstName: string;
    lastName: string;
    group: number;
    employees: {
        id: number,
        firstName: string,
        lastName: string,
        email: string
    }[];
}

class GroupManager extends Component<any>{
    state = {dataReceived: false}
    empData:EmpRecData | null;
    tsData: TSRecData[] | null;
    tsParsedData: TSData | null;
    sentReq:boolean;

    constructor(props:any) {
        super(props);
        this.tsParsedData = null;
        this.empData = null;
        this.tsData = null;
        this.sentReq = false;
    }

    componentDidMount() {
        this.UpdateEmpData();
    }

    private UpdateTSData(empId:number, empFirstName:string, empLastName: string):void {
        let api:BaseApiHandler = new BaseApiHandler();
        api.get(`/api/time/register/get?user=${empId}&period=${0},${Date.now()}`, {},(apiData) => {
            this.tsData = JSON.parse(JSON.stringify(apiData));
            let tsRawData: TSRecData[] | null = JSON.parse(JSON.stringify(apiData))['data'];
            // Convert the received data:
            if (tsRawData != null) {
                let tasks: TSTaskData[] = [];

                // For each piece of data received, we want to append the information to our own better structure.
                // for (let i = 0; i < tsRawData.length; i++) {
                //     let dayOfWeek: number = new Date(tsRawData[i].date).getDay();
                //     let tsExists: boolean = false;
                //     for (let j = 0; j < tasks.length; j++) {
                //         // If the task already exist, push the date registration to registrations
                //         if (tasks[j].taskId === tsRawData[i].taskId) {
                //             tsExists = true;
                //             tasks[j][dayOfWeek] = this.TSRawToDateRegistration(tsRawData[i]);
                //         }
                //     }
                //     
                //     // If the task didn't exist, register it and the time as well:
                //     if (!tsExists) {
                //         let newTaskReg: TSTaskData = this.TSRawToTask(tsRawData[i]);
                //         newTaskReg[dayOfWeek] = this.TSRawToDateRegistration(tsRawData[i]);
                //         tasks.push(newTaskReg);
                //     }
                // }

                for (let i = 0; i < tsRawData.length; i++) {
                    let date: number = tsRawData[i].date;
                    let dayOfWeek: number = (new Date(date).getDay() + 1) % 7

                    if (true) {
                        let tsExists: boolean = false
                        for (let j = 0; j < tasks.length; j++) {
                            // Check if the task already exists. Add the information.
                            if (tasks[j].taskId === tsRawData[i].taskId) {
                                tsExists = true;
                                tasks[j][dayOfWeek] = this.TSRawToDateRegistration(tsRawData[i]);
                            }
                        }

                        if (!tsExists) {
                            let newTaskReg: TSTaskData = this.TSRawToTask(tsRawData[i]);
                            newTaskReg[dayOfWeek] = this.TSRawToDateRegistration(tsRawData[i]);
                            tasks.push(newTaskReg);
                        }
                    }
                }

                this.tsParsedData = {tasks: tasks, empFirstName: empFirstName, empLastName: empLastName};
                console.log(this.tsParsedData)
            }

            this.setState({tsDataReceived: true});
        });
        return;
    }

    private TSRawToDateRegistration(rawData:TSRecData):TSDateRegistration {
        let date:number = Date.now();
        return {
            approved: rawData.approved,
            time: rawData.time,
            managerLogged: rawData.managerLogged,
            date: date,
        }
    }

    private TSRawToTask(rawData:TSRecData):TSTaskData {
        return {
            taskId: rawData.taskId,
            taskName: rawData.taskName,
            userId: rawData.userId,
            projectId: rawData.projectId,
            projectName: rawData.projectName,
        }
    }

    private UpdateEmpData():void {
        if (userInfo.isManager) {
            if (!this.sentReq) {
                this.sentReq = true
                let api:BaseApiHandler = new BaseApiHandler();
                api.get(`/api/group/manager/get?manager=${userInfo.userId}`,  {}, (apiData) => {
                    this.empData = JSON.parse(JSON.stringify(apiData))['data'][0];
                    this.setState({dataReceived: true});
                });
            }
        }

        // if (!this.sentReq) {
        //     this.sentReq = true;
        //     let api:BaseApiHandler = new BaseApiHandler("test");
        //     api.get(`/api/group/manager/get?manager=${userInfo.userId}`,  {}, (apiData) => {
        //         this.empData = JSON.parse(JSON.stringify(apiData))['data'][0];
        //         this.setState({dataReceived: true});
        //     });
        // }
        return;
    }

    private SelectedEmployeeTimesheetTable():JSX.Element {
        if (!this.tsParsedData) return (<></>);

        console.log(this.tsParsedData);
        
        return (
            <>
                {
                    !this.tsParsedData?(
                        <h4>Loading empdata...</h4>
                    ):(
                        <>
                            <h4>Displaying timesheet {this.tsParsedData?.empFirstName} {this.tsParsedData?.empLastName}</h4>
                            <Table>
                                <thead>
                                <tr>
                                    <th className={"col-sm-1"}>Project</th>
                                    <th className={"col-sm-1"}>Task</th>
                                    <th>Sun</th>
                                    <th></th>
                                    <th>Mon</th>
                                    <th></th>
                                    <th>Tue</th>
                                    <th></th>
                                    <th>Wed</th>
                                    <th></th>
                                    <th>Thu</th>
                                    <th></th>
                                    <th>Fri</th>
                                    <th></th>
                                    <th>Sat</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.tsParsedData.tasks.map(t => (
                                        <tr>
                                            <td className={"col-sm-1"}>{t.projectName}</td>
                                            <td className={"col-sm-1"}>{t.taskName}</td>
                                            {
                                                [0,1,2,3,4,5,6].map(i => (
                                                    <>
                                                        {
                                                            t[i]?(
                                                                <>
                                                                    <td>{t[i].time}</td>
                                                                    <td>
                                                                        <ButtonGroup aria-label="Basic example">
                                                                            <Button variant="success" disabled={t[i].approved && t[i].managerLogged}>✓</Button>
                                                                            <Button variant="danger" disabled={t[i].approved && t[i].managerLogged}>🗙</Button>
                                                                        </ButtonGroup>
                                                                    </td>
                                                                </>
                                                            ):(
                                                                <>
                                                                    <td>{0}</td>
                                                                    <td>
                                                                        <ButtonGroup aria-label="Basic example">
                                                                            <Button variant="success" disabled={true}>✓</Button>
                                                                            <Button variant="danger" disabled={true}>🗙</Button>
                                                                        </ButtonGroup>
                                                                    </td>
                                                                </>
                                                            )
                                                        }
                                                    </>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                        </>
                    )
                }
            </>
        )
    }

    render() {
        return (
            <>
                <BaseNavBar />
                <Container className={"py-3"}>
                    <EmployeeTable managerID={userInfo.userId}></EmployeeTable>
                </Container>
            </>
        );
    }
}

export default GroupManager;