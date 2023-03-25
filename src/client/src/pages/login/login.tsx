/*
    Login screen & nothing else
 */
import React, {Component, FormEvent} from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import {Button, Container, Form, Row} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";
import BaseApiHandler from "../../network/baseApiHandler";
import forge from "node-forge";
import Cookies from "js-cookie";

interface AuthApi {
    status: number,
    data: {
        message: string[],
        status: boolean
    }
}

class Login extends Component<any>{
    state = {
        submitting: false,
        email: "",
        password: ""
    }

    private login(): void {
        let apiHandler = new BaseApiHandler("test");
        apiHandler.post("/api/login", {body: {email: this.state.email, password: forge.md.sha256.create().update(this.state.password).digest().toHex()}}, (value) => {
            let response: AuthApi = JSON.parse(JSON.stringify(value));
            if (response.status === 200) {
                Cookies.set("auth", response.data.message[1], {expires: Number(response.data.message[2])});
                window.location.reload();
            }
        })
    }

    private LoginFormRender(): JSX.Element {
        const handleSubmit = (event: FormEvent) => {
            event.preventDefault();
            this.setState({submitting: true});
            this.login();
        }
        return (
            <Form onSubmit={handleSubmit} >
                <Row className="justify-content-md-center py-3">
                    <Col md="auto">
                        <h1 style={{textAlign: "center"}}>Login</h1>
                    </Col>
                </Row>
                <Container>
                    <Row className="justify-content-md-center py-3">
                        <Col style={{maxWidth: "500px"}}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <FloatingLabel controlId="floatingInputEmail" label="Email address" className="mb-3">
                                    <Form.Control type="email" placeholder="name@example.com" required onChange={(e) => { this.setState({email: e.target.value})} }/>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col style={{maxWidth: "500px"}}>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <FloatingLabel controlId="floatingInputPassword" label="Password" className="mb-3">
                                    <Form.Control type="password" placeholder="Password" required onChange={(e) => { this.setState({password: e.target.value})} }/>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center py-3">
                        <Col md="auto">
                            <Button variant="primary" type="submit" size={"lg"} disabled={this.state.submitting} style={{minWidth: "125px"}}>
                                {this.state.submitting ? (<Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />) : "Login"}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Form>
        );
    }

    render() {
        return (
            <>
                <Container className={"py-5"}>
                    {this.LoginFormRender()}
                </Container>
            </>
        );
    }
}

export default Login;