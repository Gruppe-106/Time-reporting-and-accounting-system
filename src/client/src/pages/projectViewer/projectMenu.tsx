/*
    Show a list of projects a user is related to
 */
import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";
import ProjectTable, {ProjectTableRow} from "../projectViewer/components/projectTable";

interface  ProjectMenuState{
    projects: ProjectTableRow[];
}

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
                    <h1>Project Menu</h1>
                    {
                    <ProjectTable/>
                    }
                </Container>

            </>
        );
    }
}

export default ProjectMenu;