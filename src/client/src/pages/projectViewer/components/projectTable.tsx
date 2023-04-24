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

    /**
     * gets all projects from database.
     * sets state to this json information.
     */
    componentDidMount() {
        let apiHandler = new BaseApiHandler();
        apiHandler.get(`/api/project/get?ids=*`, {}, (value) => {
            let json:Api = JSON.parse(JSON.stringify(value))
            this.setState({tableRows: json.data})
        })
    }

    /**
     * Maps and returns a table containing information about each project with links associated with them.
     */
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

    /**
     * Renders the table and gets input from the tableRender
     */
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