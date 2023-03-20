/*
    Form for creating new users
 */
import React, { Component } from "react";
import BaseNavBar from "../../components/navBar";
import { Container, Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Typeahead, Highlighter} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import forge from 'node-forge';


//TODO: fixings the types as this is infact a no no but it does fix it

/**
 * Custom types
 */
interface CustomTypes {
    // * Input variables
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    password: string | null,
    assignedToManager: { roleName: string, roleId: number, userId: number, firstName: string, lastName: string } | null,
    selectedRoles: {id:number,name:string}[] | null,

    // * Database variables
    dbRoles: any[],
    dbManagers: any[],

    // * Input validation
    emailValid: boolean,

    // * Controlling components
    submitDisabled: boolean,
    showPopup: boolean,

    // * Component variables
    popupMessage: string,
    popupTitle: string

}


/**
 * Class containing utility methods
*/
class Utility {

    /**
     * Method to validate fields
     * @param userObject The object containing the current field information
     * @returns Object containing information about missings fields if any
     */
    public static CheckFields(userObject: {
        [key: string]: any
        firstName: string | null,
        lastName: string | null,
        email: string | null,
        password: string | null,
        assignedToManager: { roleName: string, roleId: number, userId: number, firstName: string, lastName: string } | null
        roles: {id:number,name:string}[] | null
    }): {
        valid: boolean,
        missingFields: number,
        errorString: string
    } {
        let missing: string[] = []
        let keys: string[] = Object.keys(userObject)
        let missingString: string = "";
        let valid: boolean = true

        for (let i = 0; i < keys.length; i++) {

            if (userObject[keys[i]] === null) {
                missing.push(keys[i])
            }
        }

        if (missing.length > 0) {

            valid = false;
            let split: string = ""

            if (missing.length === 1) {

                if (missing[0] === "firstName") {
                    split = "First name"
                } else if (missing[0] === "lastName") {
                    split = "Last name"
                } else if (missing[0] === "email") {
                    split = "Email address"
                } else if (missing[0] === "password") {
                    split = "Password"
                } else if (missing[0] === "assignedToManager") {
                    split = "Assign manager"
                } else if (missing[0] === "roles") {
                    split = "Assign roles"
                }


                missingString += "Missing field: " + split

            } else if (missing.length > 1) {


                missingString += "Missing fields: "

                for (let i = 0; i < missing.length - 1; i++) {

                    if (missing[i] === "firstName") {
                        split = "First name"
                    } else if (missing[i] === "lastName") {
                        split = "Last name"
                    } else if (missing[i] === "email") {
                        split = "Email address"
                    } else if (missing[i] === "password") {
                        split = "Password"
                    } else if (missing[i] === "assignedToManager") {
                        split = "Assign manager"
                    } else if (missing[i] === "roles") {
                        split = "Assign roles"
                    }
                    if (split) {
                        missingString += split + ", "
                    }
                    split = ""
                }

                missingString += " and "

                if (missing[missing.length - 1] === "firstName") {
                    split = "First name"
                } else if (missing[missing.length - 1] === "lastName") {
                    split = "Last name"
                } else if (missing[missing.length - 1] === "email") {
                    split = "Email address"
                } else if (missing[missing.length - 1] === "password") {
                    split = "Password"
                } else if (missing[missing.length - 1] === "assignedToManager") {
                    split = "Assign manager"
                } else if (missing[missing.length - 1] === "roles") {
                    split = "Assign roles"
                }
                missingString += split
            }

        }

        return {
            valid: valid,
            missingFields: missing.length,
            errorString: missingString
        }
    }

}

/**
 * Class containing methods for getting data from the server+9
*/
class APICalls {

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


/**
 * The user creation page it self
*/
class UserCreation extends Component<any, CustomTypes>{
    constructor(props: any) {
        super(props);
        this.state = {
            // * Input variables
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            assignedToManager: null,
            selectedRoles: null,

            // * Database variables
            dbRoles: [],
            dbManagers: [],

            // * Input validation
            emailValid: false,

            // * Component controllers
            showPopup: false,
            submitDisabled: true,

            // * Component variables
            popupMessage: "",
            popupTitle: "",

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
        this.HandleShowMessage = this.HandleShowMessage.bind(this);
        this.HandleShowTitle = this.HandleShowTitle.bind(this);
        this.HandleClose = this.HandleClose.bind(this);

        //* Test handles
        this.test = this.test.bind(this)
    }

    /**
     * Method is run before mounting
    */
    async componentDidMount() {
        const dbRoles = await APICalls.GetAllRoles()
        const dbManagers = await APICalls.GetAllManagers()

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
    private HandleFirstName(event:  React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            firstName: event.target.value ? event.target.value : null,

        })
    }

    /**
     * Handles changes to the last name input field.
     * @param event - The input change event object.
    */
    private HandleLastName(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            lastName: event.target.value ? event.target.value : null,

        })

    }

    /**
     * Handles changes to the email input field.
     * @param event - The input change event object.
    */
    private HandleEmail(event: React.ChangeEvent<HTMLInputElement>): void {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value); // check if the email is valid


        this.setState({
            email: event.target.value ? event.target.value : null,
            emailValid: emailValid,

        })
    }

    /**
     * Handles changes to the password input field.
     * @param event - The input change event object.
    */
    private HandlePassword(event: React.ChangeEvent<HTMLInputElement>): void {

        this.setState({
            password: event.target.value ? event.target.value : null

        })
    }

    /**
     * Handles changes to the assigned to manager checkbox field.
     * @param manager - The manager object.
    */
    private HandleManager(manager: any): void {
        this.setState({
            assignedToManager: manager[0] ? manager[0] : null
        })
    }

    /**
     * Handles changes to the roles select field.
     * @param roles - The selected roles array.
    */
    private HandleRoles(roles: any): void {

        this.setState({
            selectedRoles: roles.length > 0 ? roles : null,
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

        let hasShown = false;
        const sha256 = forge.md.sha256.create();

        const userObject: {
            [key: string]: any
            firstName: string | null,
            lastName: string | null,
            email: string | null,
            password: string | null,
            assignedToManager: { roleName: string, roleId: number, userId: number, firstName: string, lastName: string } | null
            roles: {id:number,name:string}[] | null
        } = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password ? sha256.update(this.state.password).digest().toHex() : null,
            assignedToManager: this.state.assignedToManager,
            roles: this.state.selectedRoles
        }

        if (!this.state.emailValid) {
            this.HandleShowTitle("Invalid e-mail adress")
            this.HandleShowMessage("Please enter a valid e-mail adress")
            this.HandleShow()
        } else {
            const validCheck: {
                valid: boolean;
                missingFields: number;
                errorString: string;
            } = Utility.CheckFields(userObject)

            if (!validCheck.valid) {

                if (validCheck.missingFields === 1) {
                    if (!hasShown) {
                        this.HandleShowTitle("Missing field")
                        this.HandleShowMessage(validCheck.errorString)
                        this.HandleShow()
                        hasShown = true;
                    }
                } else {
                    if (!hasShown) {
                        this.HandleShowTitle("Missing fields")
                        this.HandleShowMessage(validCheck.errorString)
                        this.HandleShow()
                        hasShown = true;
                    }
                }
            } else {
                this.SendUser(userObject)
            }

        }
    }

    /**
     * Handles modal opening
    */
    private HandleShow(): void {
        this.setState({ showPopup: true });
    }

    /**
     * Handles modal message state setting
     * @param message The message to be shown to the user
    */
    private HandleShowMessage(message: string): void {
        this.setState({
            popupMessage: message
        })
    }

    /**
     * Handles modal message title setting
     * @param title The message to be shown to the user
    */
    private HandleShowTitle(title: string): void {
        console.log(title)
        this.setState({
            popupTitle: title
        })
    }

    /**
     * Handles modal closing
    */
    private HandleClose() {
        this.setState({
            showPopup: false,
            popupTitle: "",
            popupMessage: ""
        });
    }


    /**
     *
     * ! Test handle methods
     *
    */


    // Test binding for testing because haha funnyman i wanna die
    private test(): void {

    }


    /**
     *
     * ! Handles data sending
     *
    */


    /**
     * Handles the sending of the user object to server
     * @param uerObject
     */
    private SendUser(userObject: {
        [key: string]: any,
        firstName: string | null,
        lastName: string | null,
        email: string | null
        password: string | null,
        assignedToManager: { roleName: string, roleId: number, userId: number, firstName: string, lastName: string } | null
        roles: {id:number,name:string}[] | null
    }) {

        this.HandleShowTitle("Successs or Error here from the server")
        this.HandleShowMessage("This is a where the server response goes")
        this.HandleShow()

        // ? Remember to delete key before sending
        delete userObject.key

    }

    render() {

        return (
            <>
                <BaseNavBar />
                <Container className="py-3">
                    <h1>User Creation</h1>
                    <Form >
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="text" placeholder="Enter first name" onChange={this.HandleFirstName} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label>Last name</Form.Label>
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
                            <Form.Label>Assign manager</Form.Label>
                            <Typeahead
                                id="assignManager"
                                labelKey={(option: any) => `${option.firstName}  ${option.lastName}`}
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
                            <Form.Label>Assign roles</Form.Label>
                            <Typeahead
                                labelKey="name"
                                id="assignRoles"
                                multiple
                                options={this.state.dbRoles}
                                placeholder="Choose roles..."
                                onChange={this.HandleRoles}

                            />
                        </Form.Group>


                        <Button variant="primary" type="button" onClick={this.HandleSubmit} >
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
                            <Modal.Title>{this.state.popupTitle}</Modal.Title>
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
