/*
    Show current and previous weeks for user, and let them register their time and type of time in a formular.
    *Potentially* Mark if not approved
 */

import React, {Component} from "react";
//import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";
import TimeSheetPage from "./componentsTime/userCom";

import { userInfo } from '../../utility/router';

class UserTimeRegister extends Component<any>{
/*    constructor(props:any) {
        super(props);
    }*/

    printUserInfo() {
        return console.log(userInfo);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container fluid="sm">
                    <h1>User Time Register: Nine and Two works for now</h1>
                </Container>
                <TimeSheetPage userId={userInfo.userId} />
                {this.printUserInfo()}
            </>
        );
    }
}

export default UserTimeRegister;