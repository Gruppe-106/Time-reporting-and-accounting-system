/*
    Main board for showing all options for the admin of the page
    *Potentials*
    Add user editor
    Custom roles
    ...
*/

/*
    Form for creating new users
*/

//React imports
import BaseNavBar from "../../components/navBar";
import Button from 'react-bootstrap/Button';
import { Container, Modal, Table } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import LoadingOverlay from 'react-loading-overlay-ts';
import React, { Component } from "react";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

//Forge import
import forge from 'node-forge';

//Custom import
import BaseApiHandler from "../../network/baseApiHandler";
import Utility from './utility/userCreation/userCreation'
import APICalls from "./utility/userCreation/apiCalls";

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    groupId: number;
    orginalGroupId?: number,
    orginalEmail?: string,
    orginalFirstName?: string,
    orginalLastName?: string,
    validEmail?: boolean
    validFirstName?: boolean
    validLastName?: boolean

}

/**
 * Custom types
 */
interface CustomTypes {

    //Input varriables

    // * Controlling components
    loading: boolean
    editing: boolean
    validEmail: boolean
    validName: boolean
    showPopup: boolean

    //* database varriables
    dbUsers: User[]
    groupMin: number | undefined,
    groupMax: number | undefined,


    // * Search Varriables
    searchQuery: string;

    // * Row operations
    selectedUsers: User[]
    selectedUsersId: number[]


    // * Component variables
    popupMessage: string,
    popupTitle: string,
    loadingText: string
    buttonText: string,

}

class AdminPanel extends Component<any, CustomTypes> {
    constructor(props: any) {
        super(props);
        this.state = {
            // * Component controllers
            loading: false,
            editing: false,
            validEmail: true,
            validName: true,
            showPopup: false,
            //* database varriables
            dbUsers: [],
            groupMax: undefined,
            groupMin: undefined,


            // * Search varriables
            searchQuery: "",

            // * Row operations
            selectedUsers: [],
            selectedUsersId: [],

            // * Component varriables
            popupMessage: "",
            popupTitle: "",
            loadingText: "",
            buttonText: "Edit",



        };
        this.handleLoader = this.handleLoader.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleGroupInput = this.handleGroupInput.bind(this)
        this.handleEmailInput = this.handleEmailInput.bind(this)
        this.handleShow = this.handleShow.bind(this);
        this.handleShowMessage = this.handleShowMessage.bind(this);
        this.handleShowTitle = this.handleShowTitle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.postChanges = this.postChanges.bind(this)
        this.renderRow = this.renderRow.bind(this);

    }

    async componentDidMount() {
        this.handleLoader("Getting users")
        const dbUsers: User[] = await APICalls.getAllUsers()
        const groups: number[] = []
        dbUsers.forEach((ele: User) => groups.push(ele.groupId))
        dbUsers.forEach((ele: User) => {
            ele.orginalGroupId = ele.groupId
            ele.orginalEmail = ele.email
            ele.orginalFirstName = ele.firstName
            ele.orginalLastName = ele.lastName
            ele.validEmail = true
            ele.validFirstName = true
            ele.validLastName = true
        })

        this.handleLoader("All done")
        this.setState(
            {
                dbUsers: dbUsers,
                groupMax: Math.max(...groups),
                groupMin: Math.min(...groups),
                loading: false
            });
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<CustomTypes>): void {
        if (this.state.selectedUsersId.length > 1 && this.state.buttonText !== "Bulk edit") {
            this.setState({ buttonText: "Bulk edit" });
        } else if (this.state.selectedUsersId.length === 1 && this.state.buttonText !== "Edit") {
            this.setState({ buttonText: "Edit" });
        }
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
            });
        } else if (!this.state.loading) {
            this.setState({
                loading: true,
                loadingText: message || ""
            });
        } else {
            this.setState({ loading: false });
        }
    }

    private handleRowClick(id: number, user: User) {
        const { selectedUsersId, selectedUsers } = this.state;
        const index = selectedUsersId.indexOf(id);
        console.log(selectedUsersId)
        console.log(selectedUsers)
        if (index === -1) {
            // If user is not already selected, add it to the state
            this.setState({ selectedUsersId: [...selectedUsersId, id] });
            this.setState({ selectedUsers: [...selectedUsers, user] });
        } else {
            // Otherwise, remove it from the state
            selectedUsersId.splice(index, 1);
            selectedUsers.splice(index, 1);
            this.setState({ selectedUsersId: [...selectedUsersId] });
            this.setState({ selectedUsers: [...selectedUsers] });
        }

    }

    private renderRow(user: User) {
        const { selectedUsersId } = this.state;

        const isSelected = selectedUsersId.indexOf(user.id) !== -1;
        const rowClassNames = document.getElementById(user.id.toString())?.className;
        const className = rowClassNames?.includes('table-primary') ? rowClassNames : isSelected ? 'table-primary' : '';

        return (
            <tr style={{ textAlign: "center" }} key={user.id} onClick={() => this.handleRowClick(user.id, user)} className={className}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.groupId}</td>
            </tr>
        );
    }

    private renderEditingRow(user: User) { //TODO: fix the prop
        return (
            <tr key={user.id}   >
                <td style={{ textAlign: 'center', verticalAlign: "middle" }}>{user.id}</td>
                <td > <Form style={{ width: '100%', margin: "auto", minWidth: "183px" }}>
                    <Form.Group >
                        <Form.Control
                            type="text"
                            style={{ textAlign: 'center' }}
                            placeholder="Enter eamil"
                            defaultValue={user.email}
                            isInvalid={!user.validEmail}
                            onChange={(e) => this.handleEmailInput(user, e)}

                        />
                    </Form.Group>
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                    </Form.Control.Feedback>
                </Form></td>
                <td><Form style={{ width: '100%', margin: "auto", minWidth: "183px" }}>
                    <Form.Group >
                        <Form.Control
                            type="text"
                            style={{ textAlign: 'center' }}
                            placeholder="Enter first name"
                            defaultValue={user.firstName}
                            isInvalid={!user.validFirstName}
                            onChange={(e) => this.handleFirstName(user, e)}

                        />
                    </Form.Group>
                </Form></td>
                <td><Form style={{ width: '100%', margin: "auto", minWidth: "183px" }}>
                    <Form.Group >
                        <Form.Control
                            type="text"
                            style={{ textAlign: 'center' }}
                            placeholder="Enter last name"
                            defaultValue={user.lastName}
                            isInvalid={!user.validLastName}
                            onChange={(e) => this.handleLastName(user, e)}

                        />
                    </Form.Group>
                </Form></td>
                <td><Form style={{ width: '69px', margin: "auto" }}>
                    <Form.Group >
                        <Form.Control
                            type="text"
                            placeholder="Enter group"
                            style={{ textAlign: 'center' }}
                            defaultValue={user.groupId}
                            onChange={(e) => this.handleGroupInput(user, e)}
                        />
                    </Form.Group>
                </Form></td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}><FontAwesomeIcon onClick={() => this.handleDelete(user)} icon={faTrash} /> </td>
            </tr>
        );
    }



    /**

        TODO: FIX THE INPUT THINGS

        Handles updating the group ID of a given user.

        @param {User} user - The user to update.

        @param {any} inputField - The input field containing the new group ID.

        @returns {void}
    */
    private handleGroupInput(user: User, inputField: any): void {
        const newValue: number = parseInt(inputField.target.value)

        if (isNaN(newValue) && inputField.target.value !== "") {
            inputField.target.value = user.orginalGroupId
        } else if (newValue > this.state.groupMax!) {
            inputField.target.value = user.orginalGroupId
        } else if (newValue < this.state.groupMin!) {
            inputField.target.value = user.orginalGroupId
        } else {
            const updatedUser = { ...user, groupId: newValue };
            this.setState({
                selectedUsers: this.state.selectedUsers.map((u) => u.id === user.id ? updatedUser : u)
            });
        }


    }


    /**

        Handles updating the email address of a given user.

        @param {User} user - The user to update.

        @param {any} input - The input field containing the new email address.

        @returns {void}
    */
    private handleEmailInput(user: User, input: any): void {
        const email: string = input.target.value;
        const isValidEmail: boolean = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        const updatedUser: User = { ...user, email, validEmail: isValidEmail };
        const updatedUsers: User[] = this.state.selectedUsers.map((u) =>
            u.id === user.id ? updatedUser : u
        );

        this.setState({
            selectedUsers: updatedUsers,
            validEmail: isValidEmail
        });


    }


    /**

        Handles updating the first name of a given user.

        @param {User} user - The user to update.

        @param {any} input - The input field containing the new first name.

        @returns {void}
    */
    private handleFirstName(user: User, input: any): void {
        const firstName: string = input.target.value;
        const validFirstName: boolean = firstName !== ""


        const updatedUser: User = { ...user, firstName, validFirstName: validFirstName };
        const updatedUsers: User[] = this.state.selectedUsers.map((u) =>
            u.id === user.id ? updatedUser : u
        );

        this.setState({
            selectedUsers: updatedUsers,
            validName: validFirstName
        });
    }


    /**

       Handles updating the last name of a given user.

       @param {User} user - The user to update.

       @param {any} input - The input field containing the new last name.

       @returns {void}
   */
    private handleLastName(user: User, input: any): void {
        const lastName: string = input.target.value;
        const validLastName: boolean = lastName !== ""


        const updatedUser: User = { ...user, lastName, validLastName: validLastName };
        const updatedUsers: User[] = this.state.selectedUsers.map((u) =>
            u.id === user.id ? updatedUser : u
        );

        this.setState({
            selectedUsers: updatedUsers,
            validName: validLastName
        });
    }

    /**
     * Deletes a user.
     *
     * @param user The user to be deleted.
     */
    private handleDelete(user: User): void {
        console.log(user);
    }

    /**
     * Toggles the editing state of the component.
     */
    private handleEditing(): void {
        this.setState({
            editing: !this.state.editing
        });
    }

    /**
     * Cancels any changes being made to the component.
     */
    private handleCancel(): void {
        this.setState({
            editing: false
        });
    }

    /**
     * Submits any changes being made to the component.
    */
    private handleSubmit(): void {
        let hasShown: boolean = false;

        if (!this.state.validName || !this.state.validEmail) {
            if (!hasShown) {
                this.handleShowTitle("Missing field")
                this.handleShowMessage("This error should not happen contact IT")
                this.handleShow()
                hasShown = true;
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
        this.setState({
            showPopup: false,
            popupTitle: "",
            popupMessage: ""
        });
    }


    private postChanges() {

    }



    render() {
        return (
            <>
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
                    <BaseNavBar />
                    <Container className="py-3">
                        <h1>Admin</h1>
                        <Form>
                            <Form.Group className="mb-3" controlId="search">
                                <Form.Label>Search Users</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter search query"
                                    value={this.state.searchQuery}
                                    onChange={(e) => this.setState({ searchQuery: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr style={{ textAlign: "center" }}>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Group</th>
                                    <th style={{ display: !this.state.editing ? "none" : "table-cell" }}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!this.state.editing ? (this.state.dbUsers
                                    .filter((user) =>
                                        user.id.toString().includes(this.state.searchQuery) ||
                                        user.email.includes(this.state.searchQuery) ||
                                        user.firstName.includes(this.state.searchQuery) ||
                                        user.lastName.includes(this.state.searchQuery) ||
                                        user.groupId.toString().includes(this.state.searchQuery)
                                    )
                                    .map((user) => this.renderRow(user))) :
                                    (this.state.selectedUsers.sort((a, b) => a.id - b.id)
                                        .filter((user) =>
                                            user.id.toString().includes(this.state.searchQuery) ||
                                            user.email.includes(this.state.searchQuery) ||
                                            user.firstName.includes(this.state.searchQuery) ||
                                            user.lastName.includes(this.state.searchQuery) ||
                                            user.groupId.toString().includes(this.state.searchQuery)
                                        )
                                        .map((user) => this.renderEditingRow(user)))}
                            </tbody>

                        </Table>
                        {!this.state.editing ?
                            <Button variant="primary" onClick={this.handleEditing}>
                                {this.state.buttonText}
                            </Button> :
                            (<div style={{ display: 'flex', gap: '10px' }}>

                                <Button disabled={!this.state.validEmail || !this.state.validName} variant="primary" onClick={this.handleSubmit}>
                                    Submit
                                </Button>

                                <Button variant="danger" onClick={this.handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                            )

                        }


                    </Container>
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

                </LoadingOverlay>
            </>
        );
    }
}

export default AdminPanel;