/*
    Show single project
 */

import React, {Component} from "react";
import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";

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
                </Container>
            </>
        );
    }
}

export default ProjectViewer;