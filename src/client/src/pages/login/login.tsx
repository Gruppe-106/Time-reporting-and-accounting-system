/*
    Login screen & nothing else
 */

import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Alert, Button, Container, Form} from "react-bootstrap";

class Login extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container className={"py-3"}>
                    <h1>Login page:</h1>
                    <BasicLoginForm />
                </Container>
                <Container className={"py-3"}>
                    <IncompleteWarning />
                </Container>
            </>
        );
    }
}

function BasicLoginForm() {
    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                    Definitely not copy pasta.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Save me?!" />
            </Form.Group>
            <Button variant="success" type="submit">
                Log in!
            </Button>
        </Form>
    );
}

function IncompleteWarning() {
    return (
        <Alert variant="danger">
            <Alert.Heading>Oh snap! It's not implemented!</Alert.Heading>
            <p>
                Form submission is not handled, and login will definitely not work.
                Please implement this, and discuss what is actually needed for login. Only e-mail or username
                as well? I'd argument only e-mail, since employees would likely have a work-email and not
                need a username.
            </p>
        </Alert>
    );
}

export default Login;