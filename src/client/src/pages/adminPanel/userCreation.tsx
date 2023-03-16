/*
    Form for creating new users
 */
import React, { Component } from "react";
import BaseNavBar from "../../components/navBar";
import { Container, Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Typeahead, Highlighter } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import forge from 'node-forge';


//TODO: fixings the types as this is infact a no no but it does fix it
interface CostumTypes {
    // * Input variables
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    assignedToManager: {roleName:string, roleId:number,userId:8,firstName:string,lastName:string} | null,
    selectedRoles: any[],

    // * Database varaibles
    dbRoles: any[],
    dbManagers: any[],

    // * Input validation
    firstNameValid: boolean,
    lastNameValid: boolean,
    emailValid: boolean,
    passwordValid: boolean,
    rolesValid: boolean,

    // * Controlling components
    submitDisabled: boolean,
    showPopup: boolean,

    // * Component variables
    popupMessage: string,

}

class GetCreationData {

    /**
     * Get all roles from the database
     * @returns Promise containing all possible roles
    */
    public static GetAllRoles(): Promise<{ id: number, name: string }[]> {
        return fetch(`/api/role/get?ids=*`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response: Response) => {
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
            .catch(error => {
                throw new Error(error.Code);
            });

    }

    /**
     * Get all roles from the database
     * @returns Promise containing all possible roles
    */
    public static GetAllManagers(): Promise<{ id: number, name: string }[]> {
        return fetch(`/api/role/user/get?role=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response: Response) => {
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
            .catch(error => {
                throw new Error(error.Code);
            });

    }
}



class UserCreation extends Component<any, CostumTypes>{
    constructor(props: any) {
        super(props);
        this.state = {
            // * Input variables
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            assignedToManager: null,
            selectedRoles: [],

            // * Database varaibles
            dbRoles: [],
            dbManagers: [],

            // * Input validation
            firstNameValid: false,
            lastNameValid: false,
            emailValid: false,
            passwordValid: false,
            rolesValid: false,

            // * Component controllers
            showPopup: false,
            submitDisabled: true,

            // * Component variables
            popupMessage: "",

        }

        // * Handles input
        this.HandleFirstName = this.HandleFirstName.bind(this);
        this.HandleLastName = this.HandleLastName.bind(this);
        this.HandleEmail = this.HandleEmail.bind(this);
        this.HandlePassword = this.HandlePassword.bind(this)
        this.HandleManager = this.HandleManager.bind(this)
        this.HandleRoles = this.HandleRoles.bind(this)

        // * Component handeling
        this.HandleSubmit = this.HandleSubmit.bind(this);
        this.HandleShow = this.HandleShow.bind(this);
        this.HandleClose = this.HandleClose.bind(this);

        //* Test handles
        this.test = this.test.bind(this)
    }


    async componentDidMount() {
        const dbRoles = await GetCreationData.GetAllRoles()
        const dbManagers = await GetCreationData.GetAllManagers()

        console.log(dbManagers)


        this.setState({
            dbRoles: dbRoles,
            dbManagers: dbManagers
        })

    }



    //TODO: find the types or else i commit the no monster day


    /**
     *
     * ! Input handle methods
     *
    */


    /**
     * Handles changes to the first name input field.
     * @param event - The input change event object.
    */
    private HandleFirstName(event: any): void {
        let validFirstName = event.target.value ? true : false
        let submitValid = this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid && this.state.passwordValid && this.state.rolesValid
        this.setState({
            firstName: event.target.value,
            firstNameValid: validFirstName,
            submitDisabled: !submitValid
        })
    }

    /**
     * Handles changes to the last name input field.
     * @param event - The input change event object.
    */
    private HandleLastName(event: any): void {
        let validLastName = event.target.value ? true : false
        let submitValid = this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid && this.state.passwordValid && this.state.rolesValid
        this.setState({
            lastName: event.target.value,
            lastNameValid: validLastName,
            submitDisabled: !submitValid
        })


    }

    /**
     * Handles changes to the email input field.
     * @param event - The input change event object.
    */
    private HandleEmail(event: any): void {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value); // check if the email is valid
        let submitValid = this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid && this.state.passwordValid && this.state.rolesValid

        this.setState({
            email: event.target.value,
            emailValid: emailValid,
            submitDisabled: !submitValid
        })

        console.log(this.state.dbRoles)
    }

    /**
     * Handles changes to the password input field.
     * @param event - The input change event object.
    */
    private HandlePassword(event: any): void {
        let passwordValid = event.target.value ? true : false
        let submitValid = this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid && this.state.passwordValid && this.state.rolesValid

        this.setState({
            password: event.target.value,
            passwordValid: passwordValid,
            submitDisabled: !submitValid
        })
    }

    /**
     * Handles changes to the assigned to manager checkbox field.
     * @param manager - The manager object.
    */
    private HandleManager(manager: any): void {
        this.setState({
            assignedToManager: manager[0]
        })
    }

    /**
     * Handles changes to the roles select field.
     * @param roles - The selected roles array.
    */
    private HandleRoles(roles: any): void {
        let rolesValid = roles.length > 0 ? true : false

        this.setState({
            selectedRoles: roles,
            rolesValid: rolesValid,
        })
    }


    /**
     *
     * ! Componant handle methods
     *
    */


    /**
     * Handles the form submission.
    */
    private HandleSubmit(): void {
        const sha256 = forge.md.sha256.create();

        const userObject: {
            firstName: string,
            lastName: string,
            email: string,
            password: string,
            assignedToManager: {roleName:string, roleId:number,userId:8,firstName:string,lastName:string} | null
            roles: any[]
        } = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: sha256.update(this.state.password).digest().toHex(),
            assignedToManager: this.state.assignedToManager,
            roles: this.state.selectedRoles
        }

        this.SendUser(userObject)

    }

    /**
     * Handles modal opening
    */
    private HandleShow(message: string): void {
        this.setState({
            popupMessage: message
        })
        this.setState({ showPopup: true });
    }

    /**
     * Handles modal closing
    */
    private HandleClose() {
        this.setState({ showPopup: false });
    }


    /**
     *
     * ! Test handle methods
     *
    */


    // Test binding for testing because haha funnyman i wanna die
    private test(): void {
        let submitValid = this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid && this.state.passwordValid && this.state.rolesValid
        console.log(submitValid)
    }


    /**
     *
     * ! Handles data sending
     *
    */


    /**
     * Handles the sending of the user object to server
     * @param UserObject
     */
    private SendUser(UserObject: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        assignedToManager: {roleName:string, roleId:number,userId:8,firstName:string,lastName:string} | null
        roles: any[]
    }) {

        this.HandleShow("Hello world man thing")

    }



    render() {

        return (
            <>
                <BaseNavBar />
                <Container className="py-3">
                    <h1>User Creation</h1>
                    <Form >
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter first name" onChange={this.HandleFirstName} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter last name" onChange={this.HandleLastName} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={this.HandleEmail} isInvalid={!this.state.emailValid} />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={this.HandlePassword} />
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formBasicAssignManager">
                            <Form.Label>Assign Manager</Form.Label>
                            <Typeahead
                                id="assignManager"
                                labelKey={(option:any) => `${option.firstName}  ${option.lastName}`}
                                options={this.state.dbManagers}
                                placeholder="Choose Manager..."
                                onChange={this.HandleManager}
                                filterBy={(option: any, props: any): boolean => {
                                    const query: string = props.text.toLowerCase().trim();
                                    const name: string = option.firstName.toLowerCase() + option.lastName.toLowerCase();
                                    const id: string = option.userId.toString();
                                    return name.includes(query) || id.includes(query);
                                }}
                                renderMenuItemChildren={(option: any, props: any) => (
                                    <>
                                        <Highlighter search={props.text}>
                                            {option.firstName + " " + option.lastName}
                                        </Highlighter>
                                        <div>
                                            <small>Manager user id: {option.userId}</small>
                                        </div>
                                    </>
                                )}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicAssignRole">
                            <Form.Label>Assign Roles</Form.Label>
                            <Typeahead
                                labelKey="name"
                                id="assignRoles"
                                multiple
                                options={this.state.dbRoles}
                                placeholder="Choose roles..."
                                onChange={this.HandleRoles}

                            />
                        </Form.Group>


                        <Button variant="primary" type="button" disabled={this.state.submitDisabled} onClick={this.HandleSubmit} >
                            {
                                /**
                                 * todo: Fix the submit logic error TODO:
                                 */
                            }
                            Submit
                        </Button>
                    </Form>
                    <Modal show={this.state.showPopup} onHide={this.HandleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Popup Title</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.popupMessage}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.HandleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </>
        );
    }



}



export default UserCreation;
