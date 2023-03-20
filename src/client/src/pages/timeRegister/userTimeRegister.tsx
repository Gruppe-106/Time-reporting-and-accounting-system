/*
    Show current and previous weeks for user, and let them register their time and type of time in a formular.
    *Potentially* Mark if not approved
 */

import React, {Component} from "react";
//import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";
import TimeSheetPage from "./componentsTime/com";

class UserTimeRegister extends Component<any>{
/*    constructor(props:any) {
        super(props);
    }*/

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container fluid="sm">
                    <h1>User Time Register</h1>
                </Container>
                <TimeSheetPage/>
            </>
        );
    }
}

export default UserTimeRegister;