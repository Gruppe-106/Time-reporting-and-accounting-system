/*
    Show single project

    TO DO:
    DEPENDING ON ID FROM OPTIONAL PARAMETER, SHOW DIFFERENT PAGE
 */

import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container, Table} from "react-bootstrap";
import {Button} from "react-bootstrap";
import ProjectInformation from "./components/projectInformation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";


class ProjectViewer extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Project Viewer</h1>
                    <Button href="/project/menu" variant="outline-secondary">Back</Button>{''}
                </Container>
                <Container>
                    {
                        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <h2>Test</h2>

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
                    //insert page here
                    }
                </Container>

            </>
        );
    }
}

export default ProjectViewer;