/*
    Show current and previous weeks for user, and let them register their time and type of time in a formular.
    *Potentially* Mark if not approved
 */

import React, {Component} from "react";
//import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";
import TimeSheetPage from "./componentsTime/userCom";
import UserTimeSheet from "./componentsTime/adminCom";
//import App from "./componentsTime/testCom";

import { userInfo } from '../../utility/router';

class UserTimeRegister extends Component<any>{
    printUserInfo() {
        return console.log(userInfo);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container fluid="lg">
                    <h1>User Time Register: Joe and John's dates work</h1>
                </Container>
                <TimeSheetPage userId={userInfo.userId} /> 
                {this.printUserInfo()}
                {userInfo.isAdmin ? (<UserTimeSheet/>) : null} {/*Button to adminCom*/}
            </>
        );
    }
}

export default UserTimeRegister;