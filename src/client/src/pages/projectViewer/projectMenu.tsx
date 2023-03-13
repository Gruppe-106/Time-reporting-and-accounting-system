/*
    Show a list of projects a user is related to
 */

import React, {Component} from "react";
import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";

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
                </Container>
            </>
        );
    }
}

export default ProjectMenu;