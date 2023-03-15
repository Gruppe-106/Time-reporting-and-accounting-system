/*
    Show all users that a group leader resides over
 */


import React, {Component} from "react";
import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Button, Container, Table} from "react-bootstrap";
import {useParams} from "react-router-dom";

interface GroupManagerProp {
}

interface EmployeeData {
    id:number;
    firstName:string;
    lastName:string;
    email:string;
}

class GroupManager extends Component<GroupManagerProp>{
    managerId:number;
    employees:EmployeeData[];
    state = {empDataLoaded: false}

    constructor(props:GroupManagerProp) {
        super(props);
        this.managerId = 0;
        this.employees = [];
    }

    async GetDataAsync():Promise<EmployeeData[]> {
        return new Promise<EmployeeData[]>((resolve, reject) => {
            let empData:EmployeeData[] = [];
            setTimeout(() => {
                let JSON_REC_FILE =
                    { "manager_group":
                            [
                                {"manager": 0, "id": 1, "firstName": "Mads", "lastName": "Mads", "email": "madshbyriel@gmail.com"},
                                {"manager": 0, "id": 2, "firstName": "Alexander", "lastName": "Alexander", "email": "madshbyriel@gmail.com"},
                                {"manager": 0, "id": 3, "firstName": "Christian", "lastName": "Christian", "email": "madshbyriel@gmail.com"},
                                {"manager": 0, "id": 4, "firstName": "Mads", "lastName": "Mads", "email": "madshbyriel@gmail.com"},
                                {"manager": 0, "id": 5, "firstName": "Mikkel", "lastName": "Mikkel", "email": "madshbyriel@gmail.com"},
                                {"manager": 0, "id": 6, "firstName": "Andreas", "lastName": "Andreas", "email": "madshbyriel@gmail.com"},
                            ],
                    };
                for (let i = 0; i < 6; i++) {
                    let emp:EmployeeData = {
                        firstName: JSON_REC_FILE.manager_group[i].firstName,
                        lastName: JSON_REC_FILE.manager_group[i].lastName,
                        id: JSON_REC_FILE.manager_group[i].id,
                        email: JSON_REC_FILE.manager_group[i].email,
                    };
                    empData.push(emp);
                }
                this.setState({empDataLoaded: true})
                resolve(empData);
            }, 3000);
        })
    }

    render() {
        this.GetDataAsync().then(data => {
            this.employees = data;
        });
        const { id } = useParams();
        this.managerId = Number(id);
        return (
            <>
                <BaseNavBar/>
                <Container className={"py-3"}>
                    <h1>Group Manager</h1>
                    {
                        (this.state.empDataLoaded)? (
                            <>
                            <h4 className={"col-sm-3"}>{this.managerId}</h4>
                            <Table striped hover bordered>
                                <thead>
                                <tr>
                                    <th className={"col-sm-3"}>First Name</th>
                                    <th className={"col-sm-3"}>Last Name</th>
                                    <th className={"col-sm-4"}>Email</th>
                                    <th className={"col-sm-2"}></th>
                                </tr>
                                </thead>
                                <tbody>
                                { this.employees.map(e => (
                                    <tr>
                                        <td className={"col-sm-3"}>{e.firstName}</td>
                                        <td className={"col-sm-3"}>{e.lastName}</td>
                                        <td className={"col-sm-4"}>{e.email}</td>
                                        <td className={"col-sm-2"}><center><Button href={"/#"} className={"col-sm-12"}>Inspect timesheet</Button></center></td>
                                    </tr>
                                )) }
                                </tbody>
                            </Table>
                            </>
                        ):(
                            <h4>Loading...</h4>
                        )
                    }
                </Container>
            </>
        );
    }
}

export default GroupManager;

/*
Data I am looking to get when I search the database of manager-employee connections, a.k.a. all employee with the same
manager, a.k.a. a group.
let JSON_REC_FILE =
    { "manager_group":
            [
                {"manager": 0, "id": 1, "firstName": "Mads", "lastName": "Mads", "email": "madshbyriel@gmail.com"},
                {"manager": 0, "id": 2, "firstName": "Alexander", "lastName": "Alexander", "email": "madshbyriel@gmail.com"},
                {"manager": 0, "id": 3, "firstName": "Christian", "lastName": "Christian", "email": "madshbyriel@gmail.com"},
                {"manager": 0, "id": 4, "firstName": "Mads", "lastName": "Mads", "email": "madshbyriel@gmail.com"},
                {"manager": 0, "id": 5, "firstName": "Mikkel", "lastName": "Mikkel", "email": "madshbyriel@gmail.com"},
                {"manager": 0, "id": 6, "firstName": "Andreas", "lastName": "Andreas", "email": "madshbyriel@gmail.com"},
            ],
    };
 */