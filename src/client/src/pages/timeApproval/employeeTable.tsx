import { Table, Button } from 'react-bootstrap'
import React, { Component } from 'react';
import { userInfo } from '../../utility/router';
import BaseApiHandler from '../../network/baseApiHandler';
import TimesheetTable from './timesheetTable';

interface TableProps {
    managerID: number;
}

interface EmployeeRecData {
    status: number,
    data:
        {
            manager?: number,
            firstName?: string,
            lastName?: string,
            group?: number,
            employees: {
                id: number,
                firstName: string,
                lastName: string,
                email?: string
            }[]
        }[]
}

interface Employee {
    firstName: string;
    lastName: string;
    id: number;
}

interface EmployeeTableTypes {
    employees: Employee[];
}

class EmployeeTable extends Component<TableProps, EmployeeTableTypes> {
    managerID: number;
    timesheetRef: React.RefObject<TimesheetTable>;

    state = {
        employees: [
            {
                id: -1, 
                firstName: "", 
                lastName: ""
            }
        ],
    }

    constructor(props: TableProps) {
        super(props);
        this.managerID = props.managerID;
        this.state.employees = [];
        this.timesheetRef = React.createRef();
    }

    private selectEmployee(id: number): void {
        this.timesheetRef.current?.setState({employeeId: id});
    } 

    private updateEmpData():void {
        if (userInfo.isManager) {
            let api: BaseApiHandler = new BaseApiHandler();
            api.get(`/api/group/manager/get?manager=${userInfo.userId}`, {}, (apiData) => {
                let recData: EmployeeRecData = JSON.parse(JSON.stringify(apiData));
                this.setState({employees: recData.data[0].employees})
            })
        }
    }

    private hasData(): boolean {
        return this.state.employees.length > 0;

    }

    componentDidMount(): void {
        this.updateEmpData();
    }

    render() {
        return (
            <>
                {this.hasData()?(
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.employees.map((e, key) => (
                                <tr key={key}>
                                    <td>{e.id}</td>
                                    <td>{e.firstName}</td>
                                    <td>{e.lastName}</td>
                                    <td><center><Button onClick={() => this.selectEmployee(e.id)}>Timesheet</Button></center></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ):null}
                <TimesheetTable ref={this.timesheetRef}></TimesheetTable>
            </>
        )
    }
}

export default EmployeeTable;