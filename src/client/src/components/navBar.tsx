import {Button, Container, Nav, Navbar, NavDropdown, Offcanvas} from "react-bootstrap";
import React, {Component} from "react";

interface DropDownItem {
    href: string;
    title: string;
}

class BaseNavBar extends Component<any>{
    currentPage: string;

    constructor(props:any) {
        super(props);
        this.currentPage = window.location.pathname;
    }

    /**
     * Creates an Element for the navbar, sets active if it's the current selected page
     * @param href String: url reference to component
     * @param title String: the displayed text in navbar
     * @private
     */
    private linkRender(href:string, title:string):JSX.Element {
        let active = false;
        //Set active if href is the same as the current loaded page
        if (href === this.currentPage) { active = true; }
        return (<Nav.Link active={active} href={href}>{title}</Nav.Link>);
    }

    /**
     * Creates a dropdown item for the navbar and sets active if any in the dropdown is selected including title
     * @param title String: the displayed text in navbar
     * @param links DropDownItem[]: list of {href:String, title:String} used to create links in dropdown
     * @private
     */
    private dropDownRender(title:string, links:DropDownItem[]):JSX.Element {
        let active = false;

        //Creating an item in the dropdown for each item given
        let linksElement = links.map((item, key) => {
                let currentActive = false;
                if (this.currentPage === item.href) { active = true; currentActive = true; }
                return (<NavDropdown.Item active={currentActive} key={key}  href={item.href}>{item.title}</NavDropdown.Item>)
        })

        //Return dropdown with all links inside and sets active if any of the links where active
        return (
            <NavDropdown menuVariant="dark" active={active} title={title}  id={`NavBar-${title}-Dropdown`}>
                {linksElement}
            </NavDropdown>
        )
    }

    render() {
        return (
            <Navbar expand="lg" bg={"dark"} variant="dark" sticky="top">
                <Container>
                    <Navbar.Brand href={"/"}>Time</Navbar.Brand>
                    <Navbar.Toggle aria-controls="offCanvasNavbar" />
                    <Navbar.Offcanvas id={`offCanvas-Navbar`}
                                      className={"text-light bg-dark"}
                                      aria-labelledby={`offCanvasNavbarLabel`}
                                      placement="end">
                        <Offcanvas.Header closeButton closeVariant={"white"}>
                            <Offcanvas.Title id={"offCanvasNavbarLabel"}>
                                Time Management
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="me-auto">
                                { this.dropDownRender("Project", [
                                    {href:"/project/create", title:"Create Project"},
                                    {href:"/project/menu"  , title:"Project Menu"},
                                ])}
                                { this.linkRender("/user-register", "Register time") }
                                { this.linkRender("/group/manager", "Group Manager") }
                                { this.linkRender("/group/time-approval", "Time Approval") }
                                { this.linkRender("/data-export", "Data") }
                            </Nav>
                            <Nav className="me-auto">
                                { this.linkRender("/admin", "Admin") }
                                { this.linkRender("/admin/create-user", "Create User") }
                            </Nav>
                            <Nav>
                                <Button variant={"primary"} href={"/login"}>Login</Button>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        );
    }
}

export default BaseNavBar;