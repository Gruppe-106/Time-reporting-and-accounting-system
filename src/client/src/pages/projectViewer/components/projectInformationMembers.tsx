import {Table} from "react-bootstrap";
import React, {Component} from "react";
import BaseApiHandler from "../../../network/baseApiHandler";

interface Api{

    id?: number,
    email?: string,
    firstName?: string,
    lastName?: string,
    group?: number

}
/*
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id") as string);
TO BE USED IN THE FUTURE
 */

class ProjectMemberTable extends Component<any> {
    state = {
        tableRows: [ {
            id: -1,
            email: "",
            firstName: "",
            lastName: "",
            group: -1
        } ]
    }

    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler();
        //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
        //Callbacks can be used to tell what to do with the data once it's been retrieved
        apiHandler.get(`/api/user/get?ids=*`,{}, (value) => {
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
                <td>{row.email ?? ''}</td>
                <td>{row.firstName ?? ''}</td>
                <td>{row.lastName ?? ''}</td>
                <td>{row.group ?? ''}</td>
            </tr>
        ))
    }

    render() {
        return(
            <Table bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Group</th>
                </tr>
                </thead>
                <tbody>
                {this.tableRender()}
                </tbody>
            </Table>
        )
    }
}

export default ProjectMemberTable;