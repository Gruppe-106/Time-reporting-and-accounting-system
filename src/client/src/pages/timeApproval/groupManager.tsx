/*
    Show all users that a group leader resides over
 */


import React, {Component} from "react";
import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";

class GroupManager extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Group Manager</h1>
                </Container>
            </>
        );
    }
}

export default GroupManager;