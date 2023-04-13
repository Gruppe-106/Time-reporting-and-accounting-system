import React, { Component } from 'react'
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Table, Button, ButtonGroup } from 'react-bootstrap'
import BaseApiHandler from '../../network/baseApiHandler';

interface TimesheetRecData {
    status: number,
    data:
      {
          taskId: number,
          taskName: string,
          projectName: string,
          projectId?: number
          date: number,
          userId?: number,
          time: number,
          approved: boolean,
          managerLogged: boolean
      }[]
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
    tasks: Task[];
    employeeId: number;
}

class TimesheetTable extends Component<any, TimesheetPropTypes> {
    prevEmployeeId: number;
    state = {
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
        employeeId: -1

    }

    constructor(props: any) {
        super(props);
        this.state.tasks = [];
        this.prevEmployeeId = -1;
    }

    private hasData(): boolean {
        if (this.state.tasks.length <= 0) return false
        return true;
    }

    private getTimesheetData() {
        if (this.state.employeeId == -1) return;
        let api:BaseApiHandler = new BaseApiHandler();
        let variables: string = 'var=taskId,taskName,projectName,date,time,approved,managerLogged';
        let request: string = `/api/time/register/get?user=${this.state.employeeId}&period=${0},${Date.now()}&` + variables;
        api.get(request, {},(apiData) => {
            let recData: TimesheetRecData = JSON.parse(JSON.stringify(apiData));
            this.setState({tasks: recData.data});
        })
    }

    private weekSelectorRender(): JSX.Element {
        return (
            <center>
                <ButtonGroup aria-label="Basic example">
                    <Button variant="primary"><FontAwesomeIcon icon={faArrowLeft} /></Button>
                    <Button variant="primary"><FontAwesomeIcon icon={faArrowRight} /></Button>
                </ButtonGroup>
            </center>
        )
    }

    render() {
        if (this.state.employeeId == -1) return null;
        if (this.prevEmployeeId != this.state.employeeId) {
            this.prevEmployeeId = this.state.employeeId;
            this.getTimesheetData();
        }
        return (
            <>
                {this.weekSelectorRender()}
                {this.hasData()?(
                    <Table>
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Task</th>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                    <>
                                        <th>{day}</th>
                                        <th></th>
                                    </>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {}
                        </tbody>
                    </Table>
                ):null}
                {this.state.employeeId}
            </>
        )  
    }
}

export default TimesheetTable 