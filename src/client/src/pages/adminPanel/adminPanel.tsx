/*
    Main board for showing all options for the admin of the page
    *Potentials*
    Add user editor
    Custom roles
    ...
*/

import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";

class AdminPanel extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Admin</h1>
                </Container>
            </>
        );
    }
}

export default AdminPanel;