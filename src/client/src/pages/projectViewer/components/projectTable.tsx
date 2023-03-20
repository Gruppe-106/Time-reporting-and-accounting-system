import {Button, Table} from "react-bootstrap";
import React, {Component} from "react";
import BaseApiHandler from "../../../network/baseApiHandler";

interface Api{

        id?: number,
        superProject?: number,
        name?: string,
        startDate?: string,
        endDate?: string

}

export interface ProjectTableRow{
    id:number
    superProject?:number
    name?:string
    startDate?:any
    endDate?:any
}

class ProjectTable extends Component<any> {
    state = {
        tableRows: [ {
            id: -1,
            superProject: "",
            name: "",
            startDate: "",
            endDate: ""
        } ]
    }

    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler("test");
        //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
        //Callbacks can be used to tell what to do with the data once it's been retrieved
        apiHandler.get(`/api/project/get?ids=*`, {}, (value) => {
            console.log(value)
            //Then convert the string to the expected object(eg. )
            let json:Api[] = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({tableRows: json})
            console.log(json)
        })
    }

    private tableRender():JSX.Element[] {
        return this.state.tableRows.map(row => (
            <tr key={row.id}>
              <td> <a href={`/project/viewer?id=${row.id}`}>{row.id}</a> </td>
              <td>{row.superProject ?? ''}</td>
              <td>{row.name ?? ''}</td>
              <td>{row.startDate ? new Date(row.startDate).toLocaleDateString() : ''}</td>
              <td>{row.endDate ? new Date(row.endDate).toLocaleDateString() : ''}</td>
                <Button href={`/project/manage?id=${row.id}`} variant="outline-primary">Edit</Button>{''}
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