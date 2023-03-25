import React, {Component} from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import {Button, Form} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
import ProjectTaskTable from "../../projectViewer/components/projectInformationTasks";
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

interface ProjectInformationProp {
    id:number
    superProject?:number
    name?:string
    startDate?:string
    endDate?:string
    assignedToManager?: { managerId: number, managerName: string }
}

class ProjectManageInformation extends Component<ProjectInformationProp> {
    state = {
        pageInformation: {id: -1, superProject: -1, name: "", startDate: "", endDate: "", assignedToManager: {"managerId": Infinity, "managerName": "" }}
    }

    constructor(props:ProjectInformationProp) {
        super(props);
        this.state.pageInformation.id = props.id;
        this.HandleManager = this.HandleManager.bind(this)
    }

     componentDidMount() {
        //First make an instance of the api handler, give it the utility key of the user once implemented
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
    private HandleManager(manager: any): void {
        this.setState({
            assignedToManager: manager[0]
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
                {this.state.pageInformation.name !== "" ? (<h1>{this.state.pageInformation.name}</h1>) : ""}
                <Form>
                    <Row>
                        <Col>
            <Form.Group className="mb-3" controlId="formBasicProjectId">
                <Form.Label>Current Project ID: {this.state.pageInformation.id}</Form.Label>
                <Form.Control type="number" placeholder="New Project ID (number)" />
            </Form.Group>
                        </Col>
                        <Col>
            <Form.Group className="mb-3" controlId="formBasicSuperProjectId">
                <Form.Label>Current Parent Project ID: {this.state.pageInformation.superProject}</Form.Label>
                <Form.Control type="number" placeholder="New Parent Project ID (number)" />
            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
            <Form.Group className="mb-3" controlId="formBasicStartDate">
                <Form.Label>Current Start Date: {new Date(this.state.pageInformation.startDate).toLocaleDateString()}</Form.Label>
                <Form.Control type="date" placeholder="1/20/1970" />
            </Form.Group>
                        </Col>
                        <Col>
             <Form.Group className="mb-3" controlId="formBasicEndDate">
                <Form.Label>Current End Date: {new Date(this.state.pageInformation.endDate).toLocaleDateString()}</Form.Label>
                <Form.Control type="date" placeholder="1/20/1970" />
            </Form.Group>
                        </Col>
                    </Row>

            <Form.Group className="mb-3" controlId="formBasicChangeManager">
                            <Form.Label>Assign New Manager</Form.Label>
                            <Typeahead
                                id="changeManager"
                                labelKey="name"
                                options={[
                                    { id: 1, name: "Andreas Monster addict" },
                                    { id: 2, name: "Mads the OG Mads" },
                                    { id: 3, name: "Mikkel the mikkelman" },
                                    { id: 4, name: "Alexander 👌" }
                                ]}
                                placeholder="Choose New Manager..."
                                onChange={this.HandleManager}
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
                    <Button variant="primary" type="button">Submit</Button>
                </Form>
            </Tab.Pane>
              <Tab.Pane eventKey="second">
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

export default ProjectManageInformation;