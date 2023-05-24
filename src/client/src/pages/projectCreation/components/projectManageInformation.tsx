import React, {Component} from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import {Alert, Button, Container, Form} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
import {Highlighter, Typeahead} from "react-bootstrap-typeahead";
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

    /**
     * Gets information about project, super projects and project leaders
     */
    componentDidMount() {
        let apiHandler = new BaseApiHandler();
        apiHandler.get(`/api/project/get?ids=${this.state.pageInformation.id}`, {},(value) => {
            let json:Api = JSON.parse(JSON.stringify(value))
            this.setState({pageInformation: json.data[0]})
        })
        //Gets all projects to use for super projects
        apiHandler.get(`/api/project/get?ids=*`, {},(value) => {
            let json:SuperProjects = JSON.parse(JSON.stringify(value))
            this.setState({parentProjects: json.data})
        })
        //Gets all users with Project Leader role
        apiHandler.get(`/api/role/user/get?role=3`, {},(value) => {
            let json:ProjectLeaders = JSON.parse(JSON.stringify(value))
            this.setState({projectLeaders: json.data})
        })
    }

    /**
     * Handles the current assigned manager
     */
    private HandleManager(manager: any): void {
        this.setState({
            assignedToManager: manager[0]
        })
    }

    /**
     * Handles the modal close
     */
    private handleClose(){
        this.setState({
            show: false
        });
    }

    /**
     * Handles the modal show
     */
    private handleShow(){
        this.setState({
            show: true
        })
    }

    /**
     * Handles the current assigned parent project
     */
    private HandleParent(selected: any): void {
        this.setState({
            selectedParentProject: selected[0] ? selected[0] : null
        });
    }

    /**
     * Handles the endDate, this is used for validating if the endDate is valid
     */
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

    /**
     * Handles the startDate, this is used for validating if the startDate is valid
     */
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

    /**
     * Handles the validity of the input form.
     * This disables the button if the form is not correctly inputted
     */
    private handleValidity() {
        const button = document.getElementById("submitbutton") as HTMLInputElement | null;
        const projectName = (document.getElementById("formBasicProjectName") as HTMLInputElement).value

        if (/^\s/g.test(projectName) ||this.state.invalidStartDate || this.state.invalidEndDate){
            button?.setAttribute('disabled', '')
        }
        else{
            button?.removeAttribute('disabled')
        }
    }

    /**
     * This handles the formSubmit.
     * Submits the data to the database which edits the existing information
     */
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
        apiHandler.put(`/api/project/edit/put`, {body:post_data}, () =>{
        })
        this.setState({formSubmitted: true})
        this.handleClose()
    }


    /**
     * Renders the project manage information page.
     * Uses a Form and typeahead to get input.
     */
    private informationRender():JSX.Element {
        return (
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">

                <Row>
                    <Col sm={2}>
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
                                            placeholder={"Choose Project Leader..."}
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
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>


        )
    }

    /**
     * Renders the elements
     */
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