import {Button, Table} from "react-bootstrap";
import React, {Component} from "react";
import BaseApiHandler from "../../../network/baseApiHandler";
import {userInfo} from "../../../utility/router";

interface Api{
    status:number,
    data: {
        id?: number,
        superProject?: number,
        name?: string,
        startDate?: string,
        endDate?: string
    }[]
}

export interface ProjectTableRow{
    id:number
    superProjectId?:number
    name?:string
    startDate?:any
    endDate?:any
}

class ProjectTable extends Component<any> {
    state = {
        tableRows: [ {
            id: -1,
            superProjectId: "",
            name: "",
            startDate: "",
            endDate: ""
        } ]
    }

    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler();
        //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
        //Callbacks can be used to tell what to do with the data once it's been retrieved
        apiHandler.get(`/api/project/get?ids=*`, {}, (value) => {
            //Then convert the string to the expected object(eg. )
            let json:Api = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({tableRows: json.data})
        })
    }

    private tableRender():JSX.Element[] {
        return this.state.tableRows.map(row => (
            <tr key={row.id}>
                <td> <a href={`/project/viewer?id=${row.id}`}>{row.id}</a> </td>
                <td>{row.superProjectId ?? ''}</td>
                <td>{row.name ?? ''}</td>
                <td>{row.startDate ? new Date(row.startDate).toLocaleDateString() : ''}</td>
                <td>{row.endDate ? new Date(row.endDate).toLocaleDateString() : ''}</td>
                {userInfo.isProjectLeader ? (<td><Button href={`/project/manage?id=${row.id}`} variant="primary" className="p-2">Edit</Button></td>): null }
                {userInfo.isProjectLeader ? (<td><Button href={`/project/create/task?id=${row.id}`} variant="primary" className="p-2">Edit task</Button></td>): null }
            </tr>
        ))
    }

    render() {
        return(
            <Table bordered hover>
                <thead>
                <tr>
                    <th>Project ID</th>
                    <th>Parent Project</th>
                    <th>Project Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                </tr>
                </thead>
                <tbody>
                {this.tableRender()}
                </tbody>
            </Table>
        )
    }
}

export default ProjectTable;