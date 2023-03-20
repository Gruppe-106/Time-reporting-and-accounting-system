import {Table} from "react-bootstrap";
import React, {Component} from "react";
import BaseApiHandler from "../../../network/baseApiHandler";
/*
NEED TO ADD SO IT SHOWS BY GROUP AND NOT JUST EVERYONE.
NUMBER FOR THE GROUP SHOULD CORRESPOND TO THE ID OF THE PROJECT AND PROJECT PAGE
 */
interface Api{

        id?: number,
        name?: string,
        startDate?: number,
        endDate?: number,
        timeType?: number

}

export interface ProjectTableTaskRow{
    id:number
    name?:string
    startDate?:number
    endDate?:number
    timeType?:number
}

const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id") as string);

class ProjectTaskTable extends Component<any> {
    state = {
        tableRows: [ {
            id: -1,
            name: "",
            startDate: -1,
            endDate: -1,
            timeType: -1
        } ]
    }

    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler("test");
        //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
        //Callbacks can be used to tell what to do with the data once it's been retrieved
        apiHandler.get(`/api/task/get?ids=*`, (value) => {
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
              <td>{row.id ?? ''}</td>
              <td>{row.name ?? ''}</td>
              <td>{row.startDate ? new Date(row.startDate).toLocaleDateString() : ''}</td>
              <td>{row.endDate ? new Date(row.endDate).toLocaleDateString() : ''}</td>
              <td>{row.timeType ?? ''}</td>
            </tr>
        ))
    }

    render() {
        return(
            <Table bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Time Type</th>
                </tr>
                </thead>
                <tbody>
                {this.tableRender()}
                </tbody>
            </Table>
        )
    }
}

export default ProjectTaskTable;