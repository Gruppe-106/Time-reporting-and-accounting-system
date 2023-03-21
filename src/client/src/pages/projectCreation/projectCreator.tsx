/*
    Show a list of projects a user is related to
 */
import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, Col, Container} from "react-bootstrap";
import {ProjectTableRow} from "../projectViewer/components/projectTable";
import ProjectCreate from "./components/projectCreate";
import Row from "react-bootstrap/Row";

interface  ProjectMenuState{
    projects: ProjectTableRow[];
}

const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id") as string);

class ProjectMenu extends Component<any, ProjectMenuState>{

    constructor(props:any) {
        super(props);

        this.state ={
            projects: []
        };
    }

    submitData(){
        //Use this function to submit/create the project and post it to the database.
        //Return an error if not all fields have been filled in

    }

    render() {
        return (
            <>
               <BaseNavBar/>
                <Container>
                    <h1>Project Creator</h1>
                    <Button href="/project/menu" variant="outline-secondary">Back</Button>{''}
                </Container>

                <Container>
                    <Row>
                        <Col sm={11}>
                    <ProjectCreate id={id}/>
                            </Col>
                        <Col>
                    <Button variant="success" type="button" onClick={() => this.submitData()}>Create Project</Button>
                            </Col>
                    </Row>
                </Container>

            </>
        );
    }
}

export default ProjectMenu;