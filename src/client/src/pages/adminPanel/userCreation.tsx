/*
    Form for creating new users
 */
import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";

class UserCreation extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>User Creation</h1>
                </Container>
            </>
        );
    }
}

export default UserCreation;