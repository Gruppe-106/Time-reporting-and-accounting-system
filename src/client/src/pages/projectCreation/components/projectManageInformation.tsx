import React, {Component} from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import {Alert, Button, Container, Form} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
import {Highlighter, Typeahead} from "react-bootstrap-typeahead";
import ProjectManageTask from "./projectManageTasks";
import Modal from "react-bootstrap/Modal";

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

interface SuperProjects{
    status: number,
    data: {
        id?: number,
        name?: string
    }[]
}

interface ProjectLeaders{
    status: number,
    data: {
        userId?: number
        firstName?: string
        lastName?: string
        roleId?: number
        roleName?: string
    }[]
}

interface ProjectInformationProp {
    id:number
    superProjectId?:number
    name?:string
    startDate?:string
    endDate?:string
    projectLeader?: {
        id: number
        lastName: string
        firstName: string
    }
    assignedToManager?: { managerId: number, managerName: string }
}

class ProjectManageInformation extends Component<ProjectInformationProp> {
    state = {
        pageInformation: {id: -1, superProjectId: -1 , name: "", startDate: "", endDate: "", projectLeader: {id: -1, lastName: "", firstName: ""}},
        parentProjects: [{id: -1, name: ""}],
        assignedToManager: {"id": Infinity, "name": "" },
        projectLeaders: [{userId: -1, firstName: "", lastName: ""}],
        selectedParentProject: {"id": Infinity, "name": ""},
        tasks: [],
        show: false,
        formSubmitted: false,
        invalidStartDate: false,
        invalidEndDate: false
    }

    constructor(props:ProjectInformationProp) {
        super(props);
        this.state.pageInformation.id = props.id;
        this.HandleManager = this.HandleManager.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleShow = this.handleShow.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler();
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
        apiHandler.get(`/api/project/get?ids=*`, {},(value) => {
            console.log(value)
            //Then convert the string to the expected object(eg. )
            let json:SuperProjects = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({parentProjects: json.data})
            console.log(json.data)
        })
        apiHandler.get(`/api/role/user/get?role=3`, {},(value) => {
            console.log(value)
            //Then convert the string to the expected object(eg. )
            let json:ProjectLeaders = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({projectLeaders: json.data})
            console.log(json.data)
        })
    }

    private HandleManager(manager: any): void {
        this.setState({
            assignedToManager: manager[0]
        })
    }
    private handleClose(){
        this.setState({
            show: false
        });
    }

    private handleShow(){
        this.setState({
            show: true
        })
    }
    private HandleParent(selected: any): void {
        this.setState({
            selectedParentProject: selected[0] ? selected[0] : null
        });
    }

    private handleEndDate(){
        const startDate = new Date((document.getElementById("formBasicStartDate") as HTMLInputElement).value)
        const endDate = new Date((document.getElementById("formBasicEndDate") as HTMLInputElement).value)
        let maxDate: Date = new Date("3000-01-01")
        let minDate: Date = new Date("1970-01-01")

         if (!(minDate > endDate || endDate > maxDate || startDate > endDate)){
            this.setState({invalidEndDate : false})
        }
        else {
            this.setState({invalidEndDate : true})
        }
    }

    private handleStartDate(){
        const startDate = new Date((document.getElementById("formBasicStartDate") as HTMLInputElement).value)
        const endDate = new Date((document.getElementById("formBasicEndDate") as HTMLInputElement).value)
        let maxDate: Date = new Date("3000-01-01")
        let minDate: Date = new Date("1970-01-01")

        if (!(startDate > endDate || startDate > maxDate || minDate > startDate)){
            this.setState({invalidStartDate : false})
        }
        else {
            this.setState({invalidStartDate : true})
        }
    }

    private handleValidity() {
        const button = document.getElementById("submitbutton") as HTMLInputElement | null;
        const projectName = (document.getElementById("formBasicProjectName") as HTMLInputElement).value

        if (/\d/g.test(projectName) ||this.state.invalidStartDate || this.state.invalidEndDate){
            button?.setAttribute('disabled', '')
        }
        else{
            button?.removeAttribute('disabled')
        }
    }

    handleFormSubmit = () =>{
        const projectName = (document.getElementById("formBasicProjectName") as HTMLInputElement).value !== null ? (document.getElementById("formBasicProjectName") as HTMLInputElement).value : undefined
        const parentProject = this.state.selectedParentProject.id !== null ? this.state.selectedParentProject.id : undefined
        const startDate = new Date((document.getElementById("formBasicStartDate") as HTMLInputElement).value) !== null
            ? new Date((document.getElementById("formBasicStartDate") as HTMLInputElement).value) : undefined

        const endDate = new Date((document.getElementById("formBasicEndDate") as HTMLInputElement).value) !== null
            ? new Date((document.getElementById("formBasicEndDate") as HTMLInputElement).value) : undefined

        const teamLeader = this.state.assignedToManager.id !== null ? this.state.assignedToManager.id : undefined
        const projectId = this.state.pageInformation.id

        const post_data = {
            projectId: projectId,
            name: projectName,
            startDate: startDate,
            endDate: endDate,
            projectLeader: teamLeader,
            superProjectId: parentProject,
        }

        let apiHandler = new BaseApiHandler();
        apiHandler.put(`/api/project/edit/put`, {body:post_data}, (value) =>{
            console.log(value);


        })
        this.setState({formSubmitted: true})
        this.handleClose()
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
                                {this.state.pageInformation.name !== "" ? (<h1>{this.state.pageInformation.name}</h1>) : ""}
                                <Form>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicProjectName" onChange={() => {this.handleValidity.call(this)}}>
                                                <Form.Label>Project Name</Form.Label>
                                                <Form.Control type="text" placeholder={this.state.pageInformation.name} maxLength={49} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicParent">
                                                <Form.Label>Assign new Parent Project</Form.Label>
                                                <Typeahead
                                                    id="chooseParent"
                                                    labelKey="name"
                                                    options={
                                                        this.state.parentProjects.map(row =>({id: row.id, name: row.name}))
                                                    }
                                                    placeholder={this.state.pageInformation.superProjectId.toString()}
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
                                            <Form.Group className="mb-3" controlId="formBasicStartDate" onChange={() => {this.handleValidity.call(this); this.handleStartDate.call(this)}}>
                                                <Form.Label>Start Date</Form.Label>
                                                <Form.Control type="date" placeholder={this.state.pageInformation.startDate} min="1970-01-01" max="3000-01-01" isInvalid={this.state.invalidStartDate}/>
                                                <Form.Control.Feedback type="invalid">
                                                    {<p><b>Date is invalid</b></p>}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasicEndDate" onChange={() => {this.handleValidity.call(this); this.handleEndDate.call(this)}}>
                                                <Form.Label>End Date</Form.Label>
                                                <Form.Control type="date" placeholder={this.state.pageInformation.endDate} min="1970-01-01" max="3000-01-01" isInvalid={this.state.invalidEndDate} />
                                                <Form.Control.Feedback type="invalid">
                                                    {<p><b>Date is invalid</b></p>}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="formBasicManager">
                                        <Form.Label>Change Project Leader</Form.Label>
                                        <Typeahead
                                            id="chooseLeader"
                                            labelKey="name"
                                            options={
                                            this.state.projectLeaders.map(row =>({id: row.userId, name: row.firstName + " " + row.lastName}))
                                            }
                                            placeholder={this.state.pageInformation.projectLeader.firstName + " " + this.state.pageInformation.projectLeader.lastName}
                                            onMenuToggle={() => {this.handleValidity.call(this)}}
                                            onChange={(value) => {this.HandleManager.call(this, value);
                                                this.handleValidity.call(this)}}
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
                                    <center>
                                    <Button variant="success" id="submitbutton" onClick={this.handleShow} size="lg">Submit changes</Button>
                                        </center>
                                    <Modal show={this.state.show} onHide={this.handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Confirm changes</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Are you sure you want to edit this project?</Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={this.handleClose}>
                                                Close
                                            </Button>
                                        <Button variant="success" type="submit" id="submitbutton" onClick={this.handleFormSubmit}>Confirm changes</Button>
                                        </Modal.Footer>
                                    </Modal>
                                </Form>
                                {this.state.formSubmitted ? (<Alert variant="success" id="alert">
                                    <Alert.Heading>Project information changed!</Alert.Heading>
                                    <p>
                                        Your project has been successfully edited, it can now be viewed under the <a href="/project/menu">project menu</a>
                                    </p>
                                </Alert>) : ""}
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <h3>Task list</h3>
                                <ProjectManageTask/>
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
                <Container>
                    <Row>
                        <Col>

                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default ProjectManageInformation;