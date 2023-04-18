/*
    Show current and previous weeks for user, and let them register their time and type of time in a formular.
    *Potentially* Mark if not approved
 */

import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";
import TimeSheetPage from "./componentsTime/userCom";
import UserTimeSheet from "./componentsTime/adminCom";
import { userInfo } from '../../utility/router';

class UserTimeRegister extends Component<any>{
    render() {
        return (
            <>
                <BaseNavBar/>
                <Container fluid="lg">
                    <h1>User Time Register:</h1>
                </Container>
                <TimeSheetPage userId={userInfo.userId} /> 
                {userInfo.isAdmin ? (<UserTimeSheet/>) : null} {/*Button to adminCom*/}
            </>
        );
    }
}

export default UserTimeRegister;