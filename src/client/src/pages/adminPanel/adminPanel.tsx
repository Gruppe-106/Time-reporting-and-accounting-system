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
    orginalGroupId?: number
}

/**
 * Custom types
 */
interface CustomTypes {

    //Input varriables

    // * Controlling components
    loading: boolean
    editing: boolean

    //* database varriables
    dbUsers: User[]
    groupMin: number | undefined,
    groupMax: number | undefined,


    // * Search Varriables
    searchQuery: string;

    // * Row operations
    selectedUsers: User[]
    selectedUsersId: number[]


    // * Component Varriables
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
            loadingText: "",
            buttonText: "Edit",



        };
        this.handleLoader = this.handleLoader.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this)
        this.handleChanges = this.handleChanges.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.renderRow = this.renderRow.bind(this);

    }

    async componentDidMount() {
        this.handleLoader("Getting users")
        const dbUsers: User[] = await APICalls.getAllUsers()
        const groups: number[] = []
        dbUsers.forEach((ele: User) => groups.push(ele.groupId))
        dbUsers.forEach((ele: User) => ele.orginalGroupId = ele.groupId)

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
            <tr key={user.id} style={{ textAlign: "center" }}>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.id}</td>
                <td> <Form style={{ width: '181px' }}>
                    <Form.Group >
                        <Form.Control
                            type="text"
                            style={{ textAlign: 'center' }}
                            placeholder="Enter eamil"
                            defaultValue={user.email}

                        />
                    </Form.Group>
                </Form></td>
                <td><Form style={{ width: '181px' }}>
                    <Form.Group >
                        <Form.Control
                            type="text"
                            style={{ textAlign: 'center' }}
                            placeholder="Enter first name"
                            defaultValue={user.firstName}

                        />
                    </Form.Group>
                </Form></td>
                <td><Form style={{ width: '181px' }}>
                    <Form.Group >
                        <Form.Control
                            type="text"
                            style={{ textAlign: 'center' }}
                            placeholder="Enter last name"
                            defaultValue={user.lastName}

                        />
                    </Form.Group>
                </Form></td>
                <td><Form style={{ width: '60px' }}>
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

    private handleDelete(user: User) {
        console.log(user)
    }


    //TODO: FIX THE INPUT THINGS
    private handleGroupInput(user: User, inputField: any) {
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
                dbUsers: this.state.dbUsers.map((u) => u.id === user.id ? updatedUser : u)
            });
        }


    }


    private handleSubmit() {
        this.setState({
            editing: !this.state.editing
        })

    }


    private handleCancel() {
        this.setState({
            editing: false
        })
    }

    private handleChanges() {

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
                            <Button variant="primary" onClick={this.handleSubmit}>
                                {this.state.buttonText}
                            </Button> :
                            (<div style={{ display: 'flex', gap: '10px' }}>

                                <Button variant="primary" onClick={this.handleChanges}>
                                    Submit
                                </Button>

                                <Button variant="danger" onClick={this.handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                            )

                        }


                    </Container>

                </LoadingOverlay>
            </>
        );
    }
}

export default AdminPanel;