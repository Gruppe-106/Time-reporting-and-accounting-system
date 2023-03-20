/*
    Show a list of projects a user is related to
 */
import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, Container} from "react-bootstrap";
import {ProjectTableRow} from "../projectViewer/components/projectTable";
import ProjectCreate from "../projectViewer/components/projectCreate";

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

    render() {
        return (
            <>
               <BaseNavBar/>
                <Container>
                    <h1>Project Creator</h1>
                    <Button href="/project/menu" variant="outline-secondary">Back</Button>{''}
                </Container>

                <Container>
                    <ProjectCreate id={id}/>
                </Container>

            </>
        );
    }
}

export default ProjectMenu;