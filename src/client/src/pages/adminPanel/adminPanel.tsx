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
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Spinner from 'react-bootstrap/Spinner';

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
    group: number;
}

/**
 * Custom types
 */
interface CustomTypes {

    //Input varriables

    // * Controlling components
    loading: boolean,

    dbUsers: User[]



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

            //* database varriables
            dbUsers: [],


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
        this.renderRow = this.renderRow.bind(this);
        
    }

    async componentDidMount() {
        this.handleLoader("Getting users")
        const dbUsers: User[] = await APICalls.getAllUsers()
        this.handleLoader("All done")
        this.setState(
            {
                dbUsers: dbUsers,
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

    private handleRowClick(id: number,user:User) {
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
            <tr key={user.id} onClick={() => this.handleRowClick(user.id,user)} className={className}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.group}</td>
            </tr>
        );
    }


    private handleSubmit(){

        console.log(this.state.selectedUsers)
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
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Group</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.dbUsers
                                    .filter((user) =>
                                        user.id.toString().includes(this.state.searchQuery) ||
                                        user.email.includes(this.state.searchQuery) ||
                                        user.firstName.includes(this.state.searchQuery) ||
                                        user.lastName.includes(this.state.searchQuery) ||
                                        user.group.toString().includes(this.state.searchQuery)
                                    )
                                    .map((user) => this.renderRow(user))}
                            </tbody>

                        </Table>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            {this.state.buttonText}
                        </Button>
                    </Container>

                </LoadingOverlay>
            </>
        );
    }
}

export default AdminPanel;