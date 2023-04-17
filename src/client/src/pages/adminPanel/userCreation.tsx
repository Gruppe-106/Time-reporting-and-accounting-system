/*
    Form for creating new users
*/

//React imports
import BaseNavBar from "../../components/navBar";
import Button from 'react-bootstrap/Button';
import { Container, Modal } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import LoadingOverlay from 'react-loading-overlay-ts';
import React, { Component } from "react";
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

//@ts-ignore
import Spinner from 'react-bootstrap/Spinner';

//Forge import
import forge from 'node-forge';

//Custom import
import BaseApiHandler from "../../network/baseApiHandler";
import Utility from './utility/userCreation/userCreation'
import APICalls from "./utility/userCreation/apiCalls";

interface Manager {
    managerId: number,
    firstName: string,
    lastName: string,
    groupId: number
}

/**
 * Custom types
 */
interface CustomTypes {
    // * Input variables
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    password: string | null,
    assignedToManager: Manager | null,
    selectedRoles: { id: number, name: string }[] | null,

    // * Database variables
    dbRoles: any[],
    dbManagers: any[],

    // * Input validation
    emailValid: boolean,

    // * Controlling components
    submitDisabled: boolean,
    showPopup: boolean,
    loading: boolean,
    reload:boolean,
    
    // * Component variables
    popupMessage: string,
    popupTitle: string,
    loadingText: string

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
            submitDisabled: false,
            loading: false,
            reload: false,

            // * Component variables
            popupMessage: "",
            popupTitle: "",
            loadingText: "",

        }

        // * Handles input
        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this)
        this.handleManager = this.handleManager.bind(this)
        this.handleRoles = this.handleRoles.bind(this)

        // * Component handeling
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleShowMessage = this.handleShowMessage.bind(this);
        this.handleShowTitle = this.handleShowTitle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleLoader = this.handleLoader.bind(this)
        this.sendUser = this.sendUser.bind(this)

        //* Test handles
        this.test = this.test.bind(this)
    }

    /**
     * Method is run before mounting
    */
    async componentDidMount() {

        this.handleLoader("Getting roles")
        const dbRoles: {
            id: number;
            name: string;
        }[] = (await APICalls.getAllRoles()).data

        this.handleLoader("Getting managers", true)
        const dbManagers: Manager[] = (await APICalls.getAllManagerGroups()).data

        this.handleLoader("All done")
        this.setState({
            dbRoles: dbRoles,
            dbManagers: dbManagers,
            loading: false
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
    private handleFirstName(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            firstName: event.target.value ? event.target.value : null,

        })
    }

    /**
     * Handles changes to the last name input field.
     * @param event - The input change event object.
    */
    private handleLastName(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            lastName: event.target.value ? event.target.value : null,

        })

    }

    /**
     * Handles changes to the email input field.
     * @param event - The input change event object.
    */
    private handleEmail(event: React.ChangeEvent<HTMLInputElement>): void {
        const emailValid: boolean = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value); // check if the email is valid


        this.setState({
            email: event.target.value ? event.target.value : null,
            emailValid: emailValid,

        })
    }

    /**
     * Handles changes to the password input field.
     * @param event - The input change event object.
    */
    private handlePassword(event: React.ChangeEvent<HTMLInputElement>): void {

        this.setState({
            password: event.target.value ? event.target.value : null

        })
    }

    /**
     * Handles changes to the assigned to manager checkbox field.
     * @param manager - The manager object.
    */
    private handleManager(manager: any): void {
        this.setState({
            assignedToManager: manager[0] ? manager[0] : null
        })
    }

    /**
     * Handles changes to the roles select field.
     * @param roles - The selected roles array.
    */
    private handleRoles(roles: any): void {

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
    private handleSubmit(): void {

        let hasShown: boolean = false;
        const sha256: any = forge.md.sha256.create();

        const userObject: {
            [key: string]: any
            firstName: string | null,
            lastName: string | null,
            email: string | null,
            password: string | null,
            assignedToManager: number | null
            roles: { id: number, name: string }[] | null
        } = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password ? sha256.update(this.state.password).digest().toHex() : null,
            assignedToManager: this.state.assignedToManager!.managerId,
            roles: this.state.selectedRoles
        }

        if (!this.state.emailValid) {
            this.handleShowTitle("Invalid e-mail adress")
            this.handleShowMessage("Please enter a valid e-mail adress")
            this.handleShow()
        } else {
            const validCheck: {
                valid: boolean;
                missingFields: number;
                errorString: string;
            } = Utility.CheckFields(userObject)

            if (!validCheck.valid) {

                if (validCheck.missingFields === 1) {
                    if (!hasShown) {
                        this.handleShowTitle("Missing field")
                        this.handleShowMessage(validCheck.errorString)
                        this.handleShow()
                        hasShown = true;
                    }
                } else {
                    if (!hasShown) {
                        this.handleShowTitle("Missing fields")
                        this.handleShowMessage(validCheck.errorString)
                        this.handleShow()
                        hasShown = true;
                    }
                }
            } else {
                this.sendUser(userObject)
            }

        }
    }

    /**
     * Handles modal opening
    */
    private handleShow(): void {
        this.setState({ showPopup: true });
    }

    /**
     * Handles modal message state setting
     * @param message The message to be shown to the user
    */
    private handleShowMessage(message: string): void {
        this.setState({
            popupMessage: message
        })
    }

    /**
     * Handles modal message title setting
     * @param title The message to be shown to the user
    */
    private handleShowTitle(title: string): void {
        this.setState({
            popupTitle: title
        })
    }

    /**
     * Handles modal closing
    */
    private handleClose(): void {
        if(this.state.reload){
            window.location.reload()
        } 
        this.setState({
            showPopup: false,
            popupTitle: "",
            popupMessage: "",
        });

    }

    /**
     * Handles loading
     * @param message Loading message
     * @param change Change message only
    */
    private handleLoader(message?: string, change: boolean = false): void {
        if (change) {
            this.setState({
                loadingText: message || ""
            })
        } else if (!this.state.loading) {
            this.setState(
                {
                    loading: true,
                    loadingText: message || ""
                })
        } else {
            this.setState({ loading: false })
        }
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
    private async sendUser(userObject: {
        [key: string]: any,
        firstName: string | null,
        lastName: string | null,
        email: string | null
        password: string | null,
        assignedToManager: number | null
        roles: { id: number, name: string }[] | null
    }) {
        const apiHandler: BaseApiHandler = new BaseApiHandler()

        let roles: number[] = []
        userObject.roles?.forEach((ele: { id: number, name: string }) => roles.push(ele.id))

        let dataToSend: {
            firstName: string | null,
            lastName: string | null,
            email: string | null,
            password: string | null,
            manager: number | null | undefined,
            roles: number[] | null
        }
            = {
            firstName: userObject.firstName,
            lastName: userObject.lastName,
            email: userObject.email,
            password: userObject.password,
            manager: userObject.assignedToManager,
            roles: roles
        }

        this.handleLoader("Creating user")
        this.setState({
            submitDisabled: true
        })

        console.log(dataToSend)
        const promise = new Promise((resolve, reject) => {
            apiHandler.post("/api/user/creation/post", { body: dataToSend }, (value:any) => {
                if (value.status === 200) {
                    this.handleShowTitle("Success");
                    this.handleShowMessage("User created");
                    this.setState({
                        reload:true
                    })
                    resolve("User created");
                } else if (value.status === 400) {
                    this.handleShowTitle("Error");
                    this.handleShowMessage("Status 400 bad request");
                    reject(new Error("Status 400 bad request"));
                } else if (value.status === 404) {
                    this.handleShowTitle("Error");
                    this.handleShowMessage(`Status 404 missing fields: ${value.missing}`);
                    reject(new Error("Status 404 missing fields"));
                } else {
                    this.handleShowTitle("Error");
                    this.handleShowMessage(`Status ${value.status}`);
                    reject(new Error(value.status));
                }
            });
        });
        await promise
        this.handleLoader()



        this.setState({
            submitDisabled: false,
            loading: false
        })

        this.handleShow()



    }

    render() {

        return (
            <LoadingOverlay
                active={this.state.loading}
                spinner
                text={this.state.loadingText}
                styles={{
                    wrapper: {
                        height: '100%',
                        width: '100%'
                    }
                }}
            >
                <>



                    <BaseNavBar />
                    <Container className="py-3">
                        <h1>User Creation</h1>
                        <Form >
                            <Form.Group className="mb-3" controlId="formBasicFirstName">
                                <Form.Label>First name</Form.Label>
                                <Form.Control type="text" placeholder="Enter first name" onChange={this.handleFirstName} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicLastName">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control type="text" placeholder="Enter last name" onChange={this.handleLastName} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" onChange={this.handleEmail} isInvalid={!this.state.emailValid} />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a valid email address.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={this.handlePassword} />
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="formBasicAssignManager">
                                <Form.Label>Assign manager</Form.Label>
                                <Typeahead
                                    id="assignManager"
                                    labelKey={(option: any) => `${option.firstName}  ${option.lastName}`}
                                    options={this.state.dbManagers}
                                    placeholder="Choose Manager..."
                                    onChange={this.handleManager}
                                    filterBy={(option: any, props: any): boolean => {
                                        const query: string = props.text.toLowerCase().trim();
                                        const name: string = (option.firstName + " " + option.lastName).toLowerCase().trim();
                                        const id: string = option.managerId.toString();
                                        const groupId: string = option.groupId.toString()
                                        return name.includes(query) || id.includes(query) || groupId.includes(query);
                                    }}
                                    renderMenuItemChildren={(option: any, props: any) => (
                                        <>
                                            <Highlighter search={props.text}>
                                                {option.firstName + " " + option.lastName}
                                            </Highlighter>
                                            <div>
                                                <small>Manager id: {option.managerId}</small>
                                            </div>
                                            <div>
                                                <small>Group id: {option.groupId}</small>
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
                                    onChange={this.handleRoles}

                                />
                            </Form.Group>


                            <Button variant="primary" type="button" onClick={this.handleSubmit} disabled={this.state.submitDisabled || !this.state.emailValid} >
                                {this.state.submitDisabled ? (
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </Form>
                        <Modal show={this.state.showPopup} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>{this.state.popupTitle}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.popupMessage}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Container>


                </>
            </LoadingOverlay>
        );
    }



}




export default UserCreation;
