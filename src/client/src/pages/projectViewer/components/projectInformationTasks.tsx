import {Table} from "react-bootstrap";
import React, {Component} from "react";
import BaseApiHandler from "../../../network/baseApiHandler";

interface Api{
    status:number,
    data:{
        id?: number,
        name?: string,
        startDate?: number,
        endDate?: number,
        timeType?: number
    }[]
}

interface TaskProjectApi{
    status: number;
    data: {
        taskId?: number,
        taskName?: string,
        projectId?: number,
        projectName?: string
    }[]
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
        } ],
        task:[{
            taskId: -1,
            taskName: "",
            projectId: -1,
            projectName: ""
        }]
    }


    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler();
        //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
        //Callbacks can be used to tell what to do with the data once it's been retrieved
        apiHandler.get(`/api/task/project/get?project=${id}`,{}, (value) => {
            //Then convert the string to the expected object(eg. )
            let json:TaskProjectApi = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({task: json.data})
            let id = []
            for (const task of json.data) {
                id.push(task.taskId)
            }
            apiHandler.get(`/api/task/get?ids=${id}`, {}, (tasks) => {
                let json:Api = JSON.parse(JSON.stringify(tasks))
                this.setState({tableRows: json.data})
            })
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