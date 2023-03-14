/*
    Show a list of projects a user is related to
 */

import React, {Component} from "react";
import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";
import ProjectTable from "../projectViewer/components/projectTable"
//import ProjectModel, {ProjectData} from "../../Models/projectModel"; - TO BE ADDED

class ProjectMenu extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Project Menu</h1>
                    <ProjectTable tableRows={[{projectId:1, superProject:-1, projectName:"test", startDate:Date.now(), endDate:Date.now()},
                    {projectId:2, superProject:1, projectName:"test2", startDate:Date.now(), endDate:Date.now()}]}/>
                </Container>

            </>
        );
    }
}

export default ProjectMenu;