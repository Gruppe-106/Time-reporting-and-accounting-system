import React, {Component} from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import {Table} from "react-bootstrap";
/*
TO DO HERE
CHANGE TO CREATE A "PAGE" FROM ID
THEN SHOW INFORMATION ABOUT PROJECT
IMPORT MEMBERS AND ROLES
 */
interface ProjectInformationProp {
    pageInformation:ProjectInformation[]
}

interface ProjectInformation {
    id:number
    superProject:number
    name:string
    startDate:number
    endDate:number
}

class ProjectInformation extends Component<ProjectInformationProp> {
    pageInformation:ProjectInformation[];
    constructor(props:ProjectInformationProp) {
        super(props);
        this.pageInformation = props.pageInformation;
    }

    private informationRender():JSX.Element[] {
        return this.pageInformation.map((info) =>{

            return (
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <h2>{info.name}</h2>

      <Row>
        <Col sm={2}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">Project Information</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Members</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
                <p>This project is about yadda yadda and it includes yadda yadda</p>
                <p>{info.id}</p>
                <p>{info.superProject}</p>
                <p>{new Date(info.startDate).toLocaleDateString()}</p>
                <p>{new Date(info.endDate).toLocaleDateString()}</p>
            </Tab.Pane>
            <Tab.Pane eventKey="second">
                <p>This here is a list of members LMAO:</p>
                <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Joe Momma (placeholder)</td>
          <td>Project Leader</td>
        </tr>
       <tr>
          <td>Big Steve</td>
          <td>Code Monkey</td>
        </tr>
       <tr>
          <td>Milo</td>
          <td>Team Member</td>
        </tr>
      </tbody>
    </Table>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
                </Tab.Container>
            )
        })
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