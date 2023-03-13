/*
    Editing of projects by its respective project leader
 */

import React, {Component} from "react";
import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";

class ProjectManager extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Project Manager</h1>
                </Container>
            </>
        );
    }
}

export default ProjectManager;