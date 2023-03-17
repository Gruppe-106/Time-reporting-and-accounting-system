/*
    Main board for showing all options for the admin of the page
    *Potentials*
    Add user editor
    Custom roles
    ...
*/

import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, Container} from "react-bootstrap";
import {Buffer} from "buffer";
import BaseApiHandler from "../../network/baseApiHandler";

class AdminPanel extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    private getData() {
        let apiHandler = new BaseApiHandler("test");
        apiHandler.post("/api/user/creation/post", (value) => {}, undefined, {test: "test"})
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Admin</h1>
                    <Button onClick={this.getData}>Post test</Button>
                </Container>
            </>
        );
    }
}

export default AdminPanel;