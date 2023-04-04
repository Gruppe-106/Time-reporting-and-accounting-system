import React, {Component} from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import {Button, Form} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
import {Highlighter, Typeahead} from "react-bootstrap-typeahead";
import ProjectCreateTask from "./projectCreateTasks";

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

interface ProjectCreateProp {
    id:number
    superProject?:number
    name?:string
    startDate?:string
    endDate?:string
    assignedToManager?: { managerId: number, managerName: string }
}

class ProjectCreate extends Component<ProjectCreateProp> {
    state = {
        assignedToManager: {"id": Infinity, "name": "" },
        selectedParentProject: {"id": Infinity, "name": ""},
        pageInformation: [{id: -1, superProject: -1, name: "", startDate: "", endDate: ""}]
    }

    constructor(props:ProjectCreateProp) {
        super(props);
        this.HandleManager = this.HandleManager.bind(this)
    }

    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler("test");
        //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
        //Callbacks can be used to tell what to do with the data once it's been retrieved
        apiHandler.get(`/api/project/get?ids=*`, {},(value) => {
            console.log(value)
            //Then convert the string to the expected object(eg. )
            let json:Api = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({pageInformation: json.data})
            console.log(json.data)
        })
    }

    private HandleManager(manager: any): void {
        this.setState({
            assignedToManager: manager[0] ? manager[0] : null
        })
    }
    private HandleParent(selected: any): void {
        this.setState({
        selectedParentProject: selected[0] ? selected[0] : null
         });
    }




    handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        //const formData = new FormData(event.currentTarget)
        const projectName = (document.getElementById("formBasicProjectName") as HTMLInputElement).value
        const parentProject = this.state.selectedParentProject.id
        const startDate = new Date((document.getElementById("formBasicStartDate") as HTMLInputElement).value)
        const endDate = new Date((document.getElementById("formBasicEndDate") as HTMLInputElement).value)
        const teamLeader = this.state.assignedToManager.id


        const post_data = {
            name: projectName,
            startDate: startDate,
            endDate: endDate,
            projectLeader: [teamLeader],
            superProjectId: parentProject
        }

        let apiHandler = new BaseApiHandler("posttest");
        apiHandler.post(`/api/project/creation/post`, {body:post_data}, (value) =>{
            console.log(value);

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
                                <Nav.Link eventKey="second">Tasks</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <h1>Create a project</h1>
                                <Form onSubmit={this.handleFormSubmit}>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicProjectName">
                                                <Form.Label>Project Name*</Form.Label>
                                                <Form.Control type="text" placeholder="Project Name" />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicParent">
                                        <Form.Label>Assign Parent Project</Form.Label>
                                        <Typeahead
                                            id="chooseParent"
                                            labelKey="name"
                                            options={
                                                this.state.pageInformation.map(row =>({id: row.id, name: row.name}))
                                            }
                                            placeholder="Choose Parent Project..."
                                            onChange={(value) => this.HandleParent.call(this, value)}
                                            filterBy={(option: any, props: any): boolean => {
                                                const query: string = props.text.toLowerCase().trim();
                                                const name: string = option.name.toLowerCase();
                                                const id: string = option.id.toString();
                                                return name.includes(query) || id.includes(query);
                                            }}
                                            renderMenuItemChildren={(option: any, props: any) => (
                                                <>
                                                    <Highlighter search={props.text}>
                                                        {option.name}
                                                    </Highlighter>
                                                    <div>
                                                        <small>Project ID: {option.id}</small>
                                                    </div>
                                                </>
                                            )}
                                        />
                                    </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicStartDate">
                                                <Form.Label>Start Date*</Form.Label>
                                                <Form.Control type="date" placeholder="1/20/1970" />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicEndDate">
                                                <Form.Label>End Date*</Form.Label>
                                                <Form.Control type="date" placeholder="1/20/1970" />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="formBasicManager">
                                        <Form.Label>Assign Team Leader*</Form.Label>
                                        <Typeahead
                                            id="chooseLeader"
                                            labelKey="name"
                                            options={[
                                                { id: 1, name: "Andreas Monster addict" },
                                                { id: 2, name: "Mads the OG Mads" },
                                                { id: 3, name: "Mikkel the mikkelman" },
                                                { id: 4, name: "Alexander 👌" }
                                            ]}
                                            placeholder="Choose Team Leader..."
                                            onChange={(value) => this.HandleManager.call(this, value)}
                                            filterBy={(option: any, props: any): boolean => {
                                                const query: string = props.text.toLowerCase().trim();
                                                const name: string = option.name.toLowerCase();
                                                const id: string = option.id.toString();
                                                return name.includes(query) || id.includes(query);
                                            }}
                                            renderMenuItemChildren={(option: any, props: any) => (
                                                <>
                                                    <Highlighter search={props.text}>
                                                        {option.name}
                                                    </Highlighter>
                                                    <div>
                                                        <small>Manager id: {option.id}</small>
                                                    </div>
                                                </>
                                            )}
                                        />
                                    </Form.Group>
                                    <Col>
                        <Button variant="success" type="submit">Create Project</Button>
                            </Col>
                                </Form>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <h3>Task list</h3>
                                <ProjectCreateTask/>
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

export default ProjectCreate;