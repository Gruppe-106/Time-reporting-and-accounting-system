/*
    Show all users that a group leader resides over
 */

import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import { Container } from "react-bootstrap";
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

        return;
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