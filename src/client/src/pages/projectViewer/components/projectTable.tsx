import {Table} from "react-bootstrap";
import React, {Component} from "react";

interface ProjectTableProp{
    tableRows:ProjectTableRow[]
}

interface ProjectTableRow{
    id:number
    superProject:number
    name:string
    startDate:number
    endDate:number
}

class ProjectTable extends Component<ProjectTableProp> {
    tableRows:ProjectTableRow[];
    constructor(props:ProjectTableProp) {
        super(props);
        this.tableRows = props.tableRows;
    }
    private tableRender():JSX.Element[]{
        return this.tableRows.map((row) =>{

            return (<tr>
                <td> <a href={`/project/viewer?id=${row.id}`}>{row.id}</a> </td>
                <td>{row.superProject}</td>
                <td>{row.name}</td>
                <td>{new Date(row.startDate).toLocaleDateString()}</td>
                <td>{new Date(row.endDate).toLocaleDateString()}</td>
            </tr>)
        })
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