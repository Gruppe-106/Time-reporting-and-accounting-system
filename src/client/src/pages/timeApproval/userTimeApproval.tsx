/*
    Show a singular user and the time for that week, potentially add going back in time
 */


import React, {Component} from "react";
import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";

class UserTimeApproval extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Time approval</h1>
                </Container>
            </>
        );
    }
}

export default UserTimeApproval;