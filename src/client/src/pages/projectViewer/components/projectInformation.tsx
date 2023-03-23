import React, {Component} from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import {Table} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
import ProjectMemberTable from "./projectInformationMembers";
import ProjectTaskTable from "./projectInformationTasks";
/*
TO DO HERE
CHANGE TO CREATE A "PAGE" FROM ID
THEN SHOW INFORMATION ABOUT PROJECT
IMPORT MEMBERS AND ROLES
*/

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

interface ProjectInformationProp {
    id:number
    superProject?:number
    name?:string
    startDate?:string
    endDate?:string
}

class ProjectInformation extends Component<ProjectInformationProp> {
    state = {
        pageInformation: {id: -1, superProject: -1, name: "", startDate: "", endDate: ""}
    }

    constructor(props:ProjectInformationProp) {
        super(props);
        this.state.pageInformation.id = props.id;
    }

    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler("test");
        //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
        //Callbacks can be used to tell what to do with the data once it's been retrieved
        apiHandler.get(`/api/project/get?ids=${this.state.pageInformation.id}`, {},(value) => {
            console.log(value)
            //Then convert the string to the expected object(eg. )
            let json:Api = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({pageInformation: json.data[0]})
            console.log(json.data)
        })
    }


    private informationRender():JSX.Element {
        return (
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">

                <Row>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Project Information</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">Members</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="third">Tasks</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                {this.state.pageInformation.name !== "" ? (<h1>{this.state.pageInformation.name}</h1>) : ""}
                                <h3>Description</h3>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Start Date: {new Date(this.state.pageInformation.startDate).toLocaleDateString()}</th>
                                        <th>End Date: {new Date(this.state.pageInformation.endDate).toLocaleDateString()}</th>
                                    </tr>
                                    <tr>
                                        <th>Project Number: {this.state.pageInformation.id}</th>
                                        <th>Parent Project: {this.state.pageInformation.superProject}</th>
                                    </tr>
                                    <tr>
                                        <th>Project Manager: no one</th>
                                    </tr>
                                    </thead>
                                </Table>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <h3>Members list</h3>
                                <ProjectMemberTable/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="third">
                                <h3>Task list</h3>
                                <ProjectTaskTable/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        )
    }

    render() {
        return(
            <div>
                {this.informationRender()}
            </div>
        )
    }
}

export default ProjectInformation;