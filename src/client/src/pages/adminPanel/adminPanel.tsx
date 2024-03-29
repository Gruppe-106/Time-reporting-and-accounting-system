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
import { Component } from "react";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faHand } from '@fortawesome/free-solid-svg-icons'
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead';


//Custom import
import BaseApiHandler from "../../network/baseApiHandler";

import APICalls from "./utility/apiCalls";

import type { StateTypesAP, Manager, User, UserDataPost } from "./adminPanelTypes";



class AdminPanel extends Component<any, StateTypesAP> {
    constructor(props: any) {
        super(props);
        this.state = {
            // * Component controllers
            loading: false,
            editing: false,
            validEmail: true,
            validName: true,
            showPopup: false,
            showDelete: false,
            showError: false,

            //* database varriables
            dbUsers: [],
            dbManagers: [],
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
            test: [],
            userToDelete: null



        };
        this.handleLoader = this.handleLoader.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleEmailInput = this.handleEmailInput.bind(this)
        this.handleShow = this.handleShow.bind(this);
        this.handleShowMessage = this.handleShowMessage.bind(this);
        this.handleShowTitle = this.handleShowTitle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDeleteClose = this.handleDeleteClose.bind(this)
        this.postChanges = this.postChanges.bind(this)
        this.renderRow = this.renderRow.bind(this);

    }

    /**
     * Runs after all components have mounted
    */
    async componentDidMount(): Promise<void> {
        this.handleLoader("Getting users")


        const dbManagers: Manager[] = await APICalls.getAllManagerGroups()
        const dbUsers: User[] = await APICalls.getAllUsers()

        const groups: number[] = []
        dbUsers.forEach((ele: User) => {
            groups.push(ele.groupId)
            ele.orginalGroupId = ele.groupId
            ele.orginalEmail = ele.email
            ele.orginalFirstName = ele.firstName
            ele.orginalLastName = ele.lastName
            ele.validEmail = true
            ele.validFirstName = true
            ele.validLastName = true
            ele.manager = dbManagers.filter((man: Manager) => man.groupId === ele.groupId && man.managerId !== ele.id).concat(dbManagers.filter((man: Manager) => man.groupId !== ele.groupId))
            console.log(ele.manager)
        })

        this.handleLoader("All done")
        this.setState(
            {
                dbUsers: dbUsers,
                dbManagers: dbManagers,
                groupMax: Math.max(...groups),
                groupMin: Math.min(...groups),
                loading: false
            });

    }


    /**
     * Runs whenever a state updates
     * @param prevProps The previous props
     * @param prevState The previous state
    */
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<StateTypesAP>): void {
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

    /**
     * Handle row click event and update selectedUsersId and selectedUsers states accordingly.
     *
     * @param {number} id - The id of the clicked row.
     * @param {User} user - The User object of the clicked row.
     * @returns {void}
    */
    private handleRowClick(id: number, user: User): void {
        const { selectedUsersId, selectedUsers }: { selectedUsersId: number[], selectedUsers: User[] } = this.state;
        const index: number = selectedUsersId.indexOf(id);
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

    /**
     * Render a row of the table for a given user object, with optional highlighting if the row is selected.
     *
     * @param {User} user - The User object to render a row for.
     * @returns {JSX.Element | undefined} - A JSX Element for the row, or undefined if user has no manager.
    */
    private renderRow(user: User): JSX.Element | undefined {
        const { selectedUsersId }: { selectedUsersId: number[] } = this.state;

        const isSelected: boolean = selectedUsersId.indexOf(user.id) !== -1;
        const rowClassNames: string | undefined = document.getElementById(user.id.toString())?.className;
        const className: string = rowClassNames?.includes('table-primary') ? rowClassNames : isSelected ? 'table-primary' : '';

        if (user.manager?.length !== 0) {
            return (
                <tr style={{ textAlign: "center" }} key={user.id} onClick={() => this.handleRowClick(user.id, user)} className={className}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.manager![0].firstName + " " + user.manager![0].lastName}</td>
                    <td>{user.groupId}</td>
                </tr>
            );
        }

    }


    /**
        * Render a row of the table for a given user object, with optional highlighting if the row is selected.
        *
        * @param {User} user - The User object to render a row for.
        * @returns {JSX.Element | undefined} - A JSX Element for the row, or undefined if user has no manager.
   */
    private renderEditingRow(user: User): JSX.Element | undefined {
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

                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <Typeahead
                        id={`manager${user.id}`}
                        style={{ width: '100%', margin: "auto", minWidth: "183px" }}
                        labelKey={(option: any) => `${option.firstName}  ${option.lastName}`}
                        options={user.manager!.filter((ele: Manager) => ele.managerId !== user.id)}
                        defaultSelected={[user.manager!.filter((ele: Manager) => ele.managerId !== user.id)[0]]}

                        onChange={(selected => this.handleManagerInput(selected, user))}
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
                        )} />
                </td>
                <td><Form style={{ width: '69px', margin: "auto" }}>
                    <Form.Group >
                        <Form.Control
                            id={`user${user.id}`}
                            type="text"
                            placeholder="Enter group"
                            style={{ textAlign: 'center' }}
                            defaultValue={user.groupId}
                            disabled={true}
                        />
                    </Form.Group>
                </Form></td>
                {this.state.dbManagers.findIndex((ele: Manager) => ele.managerId === user.id) === -1 ? <td style={{ textAlign: 'center', verticalAlign: 'middle' }}><FontAwesomeIcon style={{ cursor: "pointer" }} onClick={() => this.handleDeleteShow(user)} icon={faTrash} /> </td> :
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}><FontAwesomeIcon icon={faHand} /> </td>}
            </tr>
        );
    }


    /**

        Updates the user's group ID and manager based on the provided manager information.

        @param {any} manager - The manager information to update the user's group ID and manager.

        @param {User} user - The user whose group ID and manager are being updated.

        @returns {void}

        @memberOf ClassName

        @private
    */
    private handleManagerInput(manager: any, user: User): void {

        if (manager.length === 1) {
            //@ts-ignore
            document.getElementById(`user${user.id}`).value = manager[0].groupId

            const updatedUser: User = { ...user, groupId: manager[0].groupId, manager: this.state.dbManagers.filter((man: Manager) => man.groupId === manager[0].groupId).concat(this.state.dbManagers.filter((man: Manager) => man.groupId !== manager[0].groupId)) };
            const updatedUsers: User[] = this.state.selectedUsers.map((u) =>
                u.id === user.id ? updatedUser : u
            );

            this.setState({
                selectedUsers: updatedUsers
            })

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
        } else {
            this.postChanges()
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
    private async handleClose(): Promise<void> {

        this.handleLoader("Updating users")

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
            ele.manager = this.state.dbManagers.filter((man: Manager) => man.groupId === ele.groupId && man.managerId !== ele.id).concat(this.state.dbManagers.filter((man: Manager) => man.groupId !== ele.groupId))
        })

        this.handleLoader("All done")
        this.setState(
            {
                dbUsers: dbUsers,
                groupMax: Math.max(...groups),
                groupMin: Math.min(...groups),
                loading: false,
                editing: false,
                selectedUsers: [],
                selectedUsersId: [],
                showPopup: false,
                popupTitle: "",
                popupMessage: ""
            });
    }

    /**
     * Deletes a user.
    */
    private async handleDelete(): Promise<void> {


        this.setState({
            showDelete: false,
        })
        const user: User = this.state.userToDelete!
        this.handleLoader("Deleting user")

        const response: any = await APICalls.deleteUser(user.id)

        if (response.status === 200 && response.data[0].success === "User deleted successfully") {
            this.handleLoader("Updating table")

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
                ele.manager = this.state.dbManagers.filter((man: Manager) => man.groupId === ele.groupId && man.managerId !== ele.id).concat(this.state.dbManagers.filter((man: Manager) => man.groupId !== ele.groupId))
            })

            this.handleLoader("All done")
            this.setState({
                selectedUsers: this.state.selectedUsers.filter((ele: any) => ele.id !== user.id),
                dbUsers: dbUsers,
                loading: false,
                groupMax: Math.max(...groups),
                groupMin: Math.min(...groups),
            })
        } else {
            this.handleLoader()
            this.handleShowTitle("Error")
            console.log(response)
            this.handleShowMessage(response.data[0].error)
            this.setState({
                showError: true,
            })
        }







    }

    /**
     * Handles the closing of the deletion modal
    */
    private async handleDeleteClose(): Promise<void> {
        this.setState({
            showDelete: false,
            userToDelete: null,
        })
    }


    /**
     * Handles the opening of the deletion modal
    */
    private async handleDeleteShow(user: User): Promise<void> {
        let hasShown: boolean = false;

        if (!hasShown) {
            this.handleShowTitle("Are you sure?")
            this.handleShowMessage("Are you sure that you want to delete this user? This action cannot be undone")
            hasShown = true;
            this.setState({
                showDelete: true,
                userToDelete: user,
            })
        }

    }


    /**
     * Post the new changes to the server
    */
    private async postChanges(): Promise<void> {
        let hasShown: boolean = false;
        const apiHandler: BaseApiHandler = new BaseApiHandler()
        const userData: UserDataPost[] = []




        for (const user of this.state.selectedUsers) {
            userData.push({
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                manager: user.manager![0].managerId
            })
        }




        this.handleLoader("Posting changes")
        const responses: boolean[] = await Promise.all(userData.map(ele => apiHandler.put("/api/user/edit/put", { body: ele })))
        this.handleLoader("All done")


        if (responses.filter((ele: boolean) => ele === false).length > 0) {
            if (!hasShown) {
                this.handleShowTitle("Error")
                this.handleShowMessage("This error should not happen contact IT")
                this.setState({
                    showError: true,
                })
                hasShown = true;
            }
        } else {
            if (!hasShown) {
                this.handleShowTitle("Success")
                this.handleShowMessage("Successfully posted changes")
                this.handleShow()
                hasShown = true;
            }
        }



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
                        <h1>Edit users</h1>
                        <Form>
                            <Form.Group className="mb-3" controlId="search">
                                <Form.Label>Search Users</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter search query"
                                    value={this.state.searchQuery}
                                    onChange={(e) => this.setState({ searchQuery: e.target.value.toLowerCase() })}
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
                                    <th >Manager</th>
                                    <th>Group</th>
                                    <th style={{ display: !this.state.editing ? "none" : "table-cell" }}>Delete</th>

                                </tr>
                            </thead>
                            <tbody>
                                {!this.state.editing ? (this.state.dbUsers
                                    .filter((user) =>
                                        user.id.toString().trim().toLowerCase().includes(this.state.searchQuery.trim()) ||
                                        user.email.toLowerCase().trim().includes(this.state.searchQuery.trim()) ||
                                        user.groupId.toString().trim().toLowerCase().includes(this.state.searchQuery.trim()) ||
                                        (user.manager![0].firstName + " " + user.manager![0].lastName).trim().toLowerCase().includes(this.state.searchQuery.trim())
                                        || (user.firstName + " " + user.lastName).trim().toLowerCase().includes(this.state.searchQuery.trim())
                                    )
                                    .map((user) => this.renderRow(user))) :
                                    (this.state.selectedUsers.sort((a, b) => a.id - b.id)
                                        .filter((user) =>
                                            user.id.toString().trim().toLowerCase().includes(this.state.searchQuery.trim()) ||
                                            user.email.toLowerCase().trim().includes(this.state.searchQuery.trim()) ||
                                            user.groupId.toString().trim().toLowerCase().includes(this.state.searchQuery.trim()) ||
                                            (user.manager![0].firstName + " " + user.manager![0].lastName).trim().toLowerCase().includes(this.state.searchQuery.trim())
                                            || (user.firstName + " " + user.lastName).trim().toLowerCase().includes(this.state.searchQuery.trim())
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

                    <Modal show={this.state.showDelete}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.popupTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.popupMessage}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleDelete}>
                                Delete user
                            </Button>
                            <Button variant="secondary" onClick={this.handleDeleteClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.showError} onHide={() => {
                        this.setState({
                            showError: false
                        })
                    }}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.popupTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.popupMessage}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => {
                                this.setState({
                                    showError: false
                                })
                            }}>
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