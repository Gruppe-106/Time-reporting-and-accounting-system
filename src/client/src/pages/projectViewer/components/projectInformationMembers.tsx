import {Table} from "react-bootstrap";
import React, {Component} from "react";
import BaseApiHandler from "../../../network/baseApiHandler";

interface Api{

    status: number,
    data: {
        taskId?: number,
        firstName?: string,
        lastName?: string,
        id?: number
    }[]
}

//Finds the search query which will be used to get information about relevant information
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id") as string);

class ProjectMemberTable extends Component<any> {
    state = {
        tableRows: [ {
            taskId: -1,
            firstName: "",
            lastName: "",
            id: -1
        } ]
    }

    /**
     * Gets project info and stores it in json file.
     * Sets the json file as the state of tableRows which will be used to show the members on the project
     */
    componentDidMount() {
        let apiHandler = new BaseApiHandler();
        apiHandler.get(`/api/project/info/get?ids=${id}`,{}, (value) => {
            let json:Api = JSON.parse(JSON.stringify(value))
            this.setState({tableRows: json.data})
        })
    }

    /**
     * Maps the information gotten from project info to a table.
     * returns table data with the information stored
     */
    private tableRender():JSX.Element[] {
        return this.state.tableRows.map((row, key) => (
            <tr key={key}>
                <td>{row.id ?? ''}</td>
                <td>{row.firstName ?? ''}</td>
                <td>{row.lastName ?? ''}</td>
                <td>{row.taskId ?? ''}</td>
            </tr>
        ))
    }

    /**
     * renders a table with table rows.
     * calls the tableRender() which has the info of the table
     */
    render() {
        return(
            <Table bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Tasks</th>
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