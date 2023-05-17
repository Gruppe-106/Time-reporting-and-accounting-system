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
        timeType?: number,
        timeName?: string
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

interface TimeTypes{
    status: number,
    data: {
        id?: number,
        name?: string
    }[]
}

//Finds the search query which will be used to get information about relevant information
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
            timeType: -1,
            timeName: ""
        } ],
        task:[{
            taskId: -1,
            taskName: "",
            projectId: -1,
            projectName: ""
        }],
    }

    /**
     * Gets project information and stores in json file
     * it will then push task id's into an array.
     * This array is then used to get information about the tasks in a new state.
     */
    componentDidMount() {
        let apiHandler = new BaseApiHandler();
        apiHandler.get(`/api/task/project/get?project=${id}`,{}, (value) => {
            let json:TaskProjectApi = JSON.parse(JSON.stringify(value))
            this.setState({task: json.data})
            let id = []
            for (const task of json.data) {
                id.push(task.taskId)
            }
            //Gets the tasks on the current project
            apiHandler.get(`/api/task/get?ids=${id}`, {}, (tasks) => {
                let taskData:Api = JSON.parse(JSON.stringify(tasks))
                //Gets the timetypes
                apiHandler.get(`/api/timetype/get?ids=*`, {}, (timeType) => {
                    let json:TimeTypes = JSON.parse(JSON.stringify(timeType));
                    let timeTypes = Array.from(json.data);
                    for (let i = 0; i < taskData.data.length; i++) {
                        let id = taskData.data[i].timeType ?? 0;
                        let name = timeTypes[id - 1].name;
                        taskData.data[i].timeName = name === undefined ? "" : name;
                    }
                    this.setState({tableRows: taskData.data})
                })

            })

        })
    }

    /**
     * Maps the information gotten to table data
     * returns these elements to be used in a table.
     */
    private tableRender():JSX.Element[] {
        return this.state.tableRows.map(row => (
            <tr key={row.id}>
                <td>{row.id ?? ''}</td>
                <td>{row.name ?? ''}</td>
                <td>{row.startDate ? new Date(row.startDate).toLocaleDateString() : ''}</td>
                <td>{row.endDate ? new Date(row.endDate).toLocaleDateString() : ''}</td>
                <td>{row.timeType ?? ''} - {row.timeName ?? ''}</td>
            </tr>
        ))
    }

    /**
     * renders a table with table rows.
     * Calls tableRender to input information
     */
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