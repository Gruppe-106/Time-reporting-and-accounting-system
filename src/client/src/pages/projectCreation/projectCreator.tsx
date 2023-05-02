import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, Col, Container} from "react-bootstrap";
import {ProjectTableRow} from "../projectViewer/components/projectTable";
import ProjectCreate from "./components/projectCreate";
import Row from "react-bootstrap/Row";

interface ProjectMenuState {
    projects: ProjectTableRow[];
}

//Gets search query, to use id to get correct page
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id") as string);

class ProjectCreator extends Component<any, ProjectMenuState> {

    constructor(props: any) {
        super(props);

        this.state = {
            projects: []
        };
    }

    /**
     * Renders the project creator page using the ProjectCreate component
     */
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

                    </Row>
                </Container>

            </>
        );
    }
}

export default ProjectCreator;