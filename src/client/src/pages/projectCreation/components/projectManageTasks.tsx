import {Form, InputGroup, Table} from "react-bootstrap";
import React, {Component} from "react";
import BaseApiHandler from "../../../network/baseApiHandler";
/*
NEED TO ADD SO IT SHOWS BY GROUP AND NOT JUST EVERYONE.
NUMBER FOR THE GROUP SHOULD CORRESPOND TO THE ID OF THE PROJECT AND PROJECT PAGE
 */
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

export interface ProjectTableTaskRow{
    id:number
    name?:string
    startDate?:number
    endDate?:number
    timeType?:number
}
/*
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id") as string);
THIS IS TO BE USED IN THE FUTURE
 */

class ProjectManageTask extends Component<any> {
    constructor(props: any) {
        super(props);

        this.handleFocus = this.handleFocus.bind(this);
        this.handleEndFocus = this.handleEndFocus.bind(this);

        this.handleBlur = this.handleBlur.bind(this);
        this.handleEndBlur = this.handleEndBlur.bind(this);

    }
    state = {
        tableRows: [ {
            id: -1,
            name: "",
            startDate: -1,
            endDate: -1,
            timeType: -1,
            isFocused: false,
            isEndFocused: false
        } ],
    }
    handleFocus(){
        this.setState({isFocused: true});
    }
    handleBlur(){
        this.setState({isFocused: false});
    }
     handleEndFocus(){
        this.setState({isEndFocused: true});
    }

    handleEndBlur(){
        this.setState({isEndFocused: false});
    }


    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler("test");
        //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
        //Callbacks can be used to tell what to do with the data once it's been retrieved
        apiHandler.get(`/api/task/get?ids=*`,{}, (value) => {
            console.log(value)
            //Then convert the string to the expected object(eg. )
            let json:Api = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({tableRows: json.data})
            console.log(json.data)
        })
    }



    private tableRender():JSX.Element[] {
        // @ts-ignore
        const { isFocused } = this.state
        // @ts-ignore
        const { isEndFocused } = this.state
        return this.state.tableRows.map(row => (
            <tr key={row.id}>
                <td><InputGroup size="sm">
                    <Form.Control
                        type="number"
                        placeholder={row.id.toString()}
                        id="id"
                    />
                </InputGroup></td>
                <td><InputGroup size="sm">
                    <Form.Control
                        type="text"
                        placeholder={row.name}
                        id="name"
                    />
                </InputGroup></td>
                <td><InputGroup size="sm"> {isFocused ?(
                    <Form.Control
                        type="date"
                        placeholder=""
                        id="startDate"
                        onBlur={this.handleBlur}
                    />):(<Form.Control
                    type="text"
                    placeholder={new Date(row.startDate).toLocaleDateString()}
                    id="startDate"
                    onFocus={this.handleFocus}
                />)}
                </InputGroup></td>
                <td><InputGroup size="sm"> {isEndFocused ?(
                    <Form.Control
                        type="date"
                        placeholder=""
                        id="endDate"
                        onBlur={this.handleEndBlur}
                    />):(<Form.Control
                    type="text"
                    placeholder={new Date(row.endDate).toLocaleDateString()}
                    id="endDate"
                    onFocus={this.handleEndFocus}
                />)}
                </InputGroup></td>
                <td><InputGroup size="sm">
                    <Form.Control
                        type="number"
                        placeholder={row.timeType.toString()}
                        id="timeType"
                    />
                </InputGroup></td>
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

export default ProjectManageTask;