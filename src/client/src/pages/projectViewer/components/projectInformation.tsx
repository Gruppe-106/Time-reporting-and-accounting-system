import React, {Component} from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import {Table} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
import ProjectMemberTable from "./projectInformationMembers";
/*
TO DO HERE
CHANGE TO CREATE A "PAGE" FROM ID
THEN SHOW INFORMATION ABOUT PROJECT
IMPORT MEMBERS AND ROLES
*/

interface Api{

        id?: number,
        superProject?: number,
        name?: string,
        startDate?: string,
        endDate?: string

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
        apiHandler.get(`/api/project/get?ids=${this.state.pageInformation.id}`, (value) => {
            console.log(value)
            //Then convert the string to the expected object(eg. )
            let json:Api[] = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({pageInformation: json[0]})
            console.log(json)
        })
    }


    private informationRender():JSX.Element {
            return (
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    {this.state.pageInformation.name !== "" ? (<h2>{this.state.pageInformation.name}</h2>) : ""}

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
                <h3>Project Description</h3>
            </Tab.Pane>
            <Tab.Pane eventKey="second">
                <h3>Members list</h3>
                <ProjectMemberTable/>
            </Tab.Pane>
              <Tab.Pane eventKey="third">
                <h3>Task list</h3>
                  <Table striped bordered hover>
      <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Understand SLIAL</td>
          <td>FAILED</td>
        </tr>
       <tr>
          <td>Make a cake</td>
          <td>ONGOING</td>
        </tr>
       <tr>
          <td>Problem analysis</td>
          <td>DONE</td>
        </tr>
      </tbody>
    </Table>
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