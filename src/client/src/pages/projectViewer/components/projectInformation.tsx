import React, {Component} from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import {Table} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
import ProjectMemberTable from "./projectInformationMembers";
import ProjectTaskTable from "./projectInformationTasks";

interface Api{
    status:number,
    data: {
        id?: number,
        superProjectId?: number,
        name?: string,
        startDate?: string,
        endDate?: string
        projectLeader?:{
            id: number
            lastName: string
            firstName: string
        }
    }[]
}

interface ProjectInformationProp {
    id:number
    superProjectId?:number
    name?:string
    startDate?:string
    endDate?:string
}

class ProjectInformation extends Component<ProjectInformationProp> {
    state = {
        pageInformation: {id: -1,
            superProjectId: -1,
            name: "",
            startDate: "",
            endDate: "",
            projectLeader: {id: -1, lastName: "", firstName: ""}},
        superProjectInfo: {name: ""}
    }

    constructor(props:ProjectInformationProp) {
        super(props);
        this.state.pageInformation.id = props.id;
    }

    /**
     * Creates new apiHandler
     * gets project information and stores it in a json file
     * sets the state of pageInformation to the data of the json file
     */
    async componentDidMount():Promise<void> {
        let apiHandler = new BaseApiHandler();
        await new Promise((resolve) => { apiHandler.get(`/api/project/get?ids=${this.state.pageInformation.id}`, {}, async (value) => {
            let json:Api = JSON.parse(JSON.stringify(value))
            this.setState({pageInformation: json.data[0]},  () => {
                resolve(true);
            })
        })})
        await apiHandler.get(`/api/project/get?ids=${this.state.pageInformation.superProjectId}`, {},(value) => {
            let superJson:Api = JSON.parse(JSON.stringify(value))
            this.setState({superProjectInfo: superJson.data[0]})
            })
    }

    /**
     * returns HTML a Tab Container containing pages of Project Information, Members and tasks
     */
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
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Start Date: {new Date(this.state.pageInformation.startDate).toLocaleDateString()}</th>
                                        <th>End Date: {new Date(this.state.pageInformation.endDate).toLocaleDateString()}</th>
                                    </tr>
                                    <tr>
                                        <th>Project Number: {this.state.pageInformation.id}</th>
                                        {this.state.pageInformation.superProjectId !== 0 ?(<th>Parent Project: {this.state.pageInformation.superProjectId} - {this.state.superProjectInfo?.name}</th>) : null}
                                    </tr>
                                    <tr>
                                        {this.state.pageInformation.projectLeader !== undefined ?(<th>Project Leader: {this.state.pageInformation.projectLeader?.firstName} {this.state.pageInformation.projectLeader?.lastName} - ID: {this.state.pageInformation.projectLeader?.id}</th>): null}
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

    /**
     * renders the HTML elements
     */
    render() {
        return(
            <div>
                {this.informationRender()}
            </div>
        )
    }
}

export default ProjectInformation;