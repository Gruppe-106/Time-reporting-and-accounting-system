import React, {Component} from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal'
import {Alert, Button, Form} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
import {Highlighter, Typeahead} from "react-bootstrap-typeahead";

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

interface ProjectCreateProp {
    id:number
    superProject?:number
    name?:string
    startDate?:string
    endDate?:string
    assignedToManager?: { managerId: number, managerName: string }
}


class ProjectCreate extends Component<ProjectCreateProp> {
    // @ts-ignore
    state = {
        assignedToManager: {"id": Infinity, "name": "" },
        selectedParentProject: {"id": Infinity, "name": ""},
        pageInformation: [{id: -1, superProject: -1, name: "", startDate: "", endDate: ""}],
        projectLeaders: [{userId: -1, firstName: "", lastName: ""}],
        tasks: [],
        show: false,
        formSubmitted: false,
        invalidStartDate: false,
        invalidEndDate: false
    }

    constructor(props:ProjectCreateProp) {
        super(props);
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
        apiHandler.get(`/api/project/get?ids=*`, {},(value) => {
            //Then convert the string to the expected object(eg. )
            let json:Api = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({pageInformation: json.data})
        })
        apiHandler.get(`/api/role/user/get?role=3`, {},(value) => {
            //Then convert the string to the expected object(eg. )
            let json:ProjectLeaders = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({projectLeaders: json.data})
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
        const startDate = new Date((document.getElementById("formBasicStartDate") as HTMLInputElement).value)
        const endDate = new Date((document.getElementById("formBasicEndDate") as HTMLInputElement).value)
        const teamLeader = this.state.assignedToManager


        if (/^\s/g.test(projectName) || projectName === '' || !/\d/g.test(startDate.toString()) || !/\d/g.test(endDate.toString()) || teamLeader?.name === '' || teamLeader?.id == null || /\d/g.test(teamLeader.name) || /\D/g.test(teamLeader.id.toString()) || this.state.invalidStartDate || this.state.invalidEndDate){
            button?.setAttribute('disabled', '')
        }
        else{
            button?.removeAttribute('disabled')
        }
    }

    handleFormSubmit = () =>{
        //event.preventDefault();
        const projectName = (document.getElementById("formBasicProjectName") as HTMLInputElement).value
        const parentProject = this.state.selectedParentProject.id
        const startDate = new Date((document.getElementById("formBasicStartDate") as HTMLInputElement).value)
        const endDate = new Date((document.getElementById("formBasicEndDate") as HTMLInputElement).value)
        const teamLeader = this.state.assignedToManager.id
        const tasks = this.state.tasks

        const post_data = {
            name: projectName,
            startDate: startDate,
            endDate: endDate,
            projectLeader: [teamLeader],
            superProjectId: parentProject,
            tasks: tasks
        }

        let apiHandler = new BaseApiHandler();
        apiHandler.post(`/api/project/creation/post`, {body:post_data}, () =>{

        })
        this.setState({formSubmitted: true})
        this.handleClose()
    }

    private informationRender():JSX.Element {

        return (
            <Row>
                <Col sm={2}>
                </Col>
                <Col sm={9}>
                    <h1>Create a project</h1>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicProjectName" onChange={() => {this.handleValidity.call(this)}}>
                                    <Form.Label>Project Name*</Form.Label>
                                    <Form.Control type="text" placeholder="Project Name" maxLength={49} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicParent">
                                    <Form.Label>Assign Parent Project (optional)</Form.Label>
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
                                <Form.Group className="mb-3" controlId="formBasicStartDate" onChange={() => {this.handleValidity.call(this); this.handleStartDate.call(this)}}>
                                    <Form.Label>Start Date*</Form.Label>
                                    <Form.Control type="date" placeholder="1/20/1970" min="1970-01-01" max="3000-01-01" isInvalid={this.state.invalidStartDate}/>
                                    <Form.Control.Feedback type="invalid">
                                        {<p><b>Date is invalid</b></p>}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEndDate" onChange={() => {this.handleValidity.call(this); this.handleEndDate.call(this)}}>
                                    <Form.Label>End Date*</Form.Label>
                                    <Form.Control type="date" placeholder="1/20/1970" min="1970-01-01" max="3000-01-01" isInvalid={this.state.invalidEndDate} />
                                    <Form.Control.Feedback type="invalid">
                                        {<p><b>Date is invalid</b></p>}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="formBasicManager">
                            <Form.Label>Assign Project Leader*</Form.Label>
                            <Typeahead
                                id="chooseLeader"
                                labelKey="name"
                                options={
                                    this.state.projectLeaders.map(row =>({id: row.userId, name: row.firstName + " " + row.lastName}))
                                }
                                placeholder="Choose Team Leader..."
                                onMenuToggle={() => {this.handleValidity.call(this)}}
                                onChange={(value) => {this.HandleManager.call(this, value);
                                    this.handleValidity.call(this)}}
                                filterBy={(option: any, props: any): boolean => {
                                    const query: string = props.text.toLowerCase().trim();
                                    const name: string = option.name.toLowerCase();
                                    const id: string = option.id.toString();
                                    return name.includes(query) ||  id.includes(query);
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
                            <Button variant="success" id="submitbutton" onClick={this.handleShow} size="lg">Submit project</Button>
                        </center>
                        <Modal show={this.state.show} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm project</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Check that you have filled out all required fields correctly *</Modal.Body>
                            <Modal.Body>Are you sure you want to create this project?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose}>
                                    Close
                                </Button>
                                <Button variant="success" type="submit" id="submitbutton" onClick={this.handleFormSubmit}>Create Project</Button>
                            </Modal.Footer>
                        </Modal>
                    </Form>
                    {this.state.formSubmitted ? (<Alert variant="success" id="alert">
                        <Alert.Heading>Project created!</Alert.Heading>
                        <p>
                            Your project has been successfully created, it can now be viewed under the <a href="/project/menu">project menu</a>
                        </p>
                    </Alert>) : ""}
                </Col>
            </Row>
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
