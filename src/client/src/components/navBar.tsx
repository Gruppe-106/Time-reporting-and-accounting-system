import {Button, Container, Nav, Navbar, NavDropdown, Offcanvas} from "react-bootstrap";
import React, {Component} from "react";

class BaseNavBar extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <Navbar expand="lg" bg={"dark"} variant="dark" sticky="top">
                <Container>
                    <Navbar.Brand href={"/"}>Time</Navbar.Brand>
                    <Navbar.Toggle aria-controls="offCanvasNavbar" />
                    <Navbar.Offcanvas id={`offCanvas-Navbar`}
                                        aria-labelledby={`offCanvasNavbarLabel`}
                                        placement="end">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={"offCanvasNavbarLabel"}>
                                Time Management
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                                <Nav className="me-auto">
                                    <Nav.Link href={"/user-register"}>Register time</Nav.Link>

                                    <NavDropdown title={"Project"}  id={"NavBar-Project-Dropdown"}>
                                        <NavDropdown.Item href={"/project/create"}>Create Project</NavDropdown.Item>
                                        <NavDropdown.Item href={"/project/manage"}>Manage Project</NavDropdown.Item>
                                        <NavDropdown.Item href={"/project/menu"}>  Project Menu  </NavDropdown.Item>
                                        <NavDropdown.Item href={"/project/viewer"}>Project Viewer</NavDropdown.Item>
                                    </NavDropdown>

                                    <Nav.Link href={"/group/manager"}>Group Manager</Nav.Link>
                                    <Nav.Link href={"/group/time-approval"}>Time Approval</Nav.Link>

                                    <Nav.Link href={"/data-export"}>Data</Nav.Link>
                                </Nav>
                            <Nav>
                                <Nav.Link href={"/admin"}>Admin</Nav.Link>
                                <Nav.Link href={"/admin/create-user"}>Create User</Nav.Link>
                                
                                <Button variant={"danger"} href={"/login"}>Login</Button>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        );
    }
}

export default BaseNavBar;