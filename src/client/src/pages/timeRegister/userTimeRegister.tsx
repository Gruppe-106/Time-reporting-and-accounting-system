/*
    Show current and previous weeks for user, and let them register their time and type of time in a formular.
    *Potentially* Mark if not approved
 */

import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";
import RegisterTable from "./registerTable";

class UserTimeRegister extends Component<any>{
    render() {
        return (
            <>
                <BaseNavBar/>
                <Container fluid="lg">
                    <h1>User Time Register:</h1>
                </Container>
                <TimeSheetPage key={1} userId={userInfo.userId} adminPicked={false} /> 
            </>
        );
    }
}

export default UserTimeRegister;