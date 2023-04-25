import React, { Component } from "react";
import BaseNavBar from "../../components/navBar";
import { Container } from "react-bootstrap";
import UserTimeSheet from "./components/adminCom";
import { userInfo } from '../../utility/router';

class AdminTimeRegister extends Component<any>{
    render() {
        return (
            <>
                <BaseNavBar />
                <Container fluid="lg">
                    <h1>User Time Register:</h1>
                </Container>
                {userInfo.isAdmin ? (<UserTimeSheet />) : null} {/*Button to adminCom*/}
            </>
        );
    }
}

export default AdminTimeRegister;