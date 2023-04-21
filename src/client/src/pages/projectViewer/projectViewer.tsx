/*
    Show single project
 */
import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, Container} from "react-bootstrap";
import ProjectInformation from "./components/projectInformation";

const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id") as string);

class ProjectViewer extends Component<any>{
    constructor(props:any) {
        super(props);

    }

    /**
     * Renders the project viewer using the ProjectInformation component
     */
    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Project Viewer</h1>
                    <Button href="/project/menu" variant="outline-secondary">Back</Button>{''}
                </Container>

                <Container>
                    <ProjectInformation id={id}/>
                </Container>

            </>
        );
    }
}

export default ProjectViewer;