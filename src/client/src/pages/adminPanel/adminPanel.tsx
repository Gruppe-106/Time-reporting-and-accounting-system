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


/**
 * Custom types
 */
interface CustomTypes {

    //Input varriables

    // * Controlling components
    loading: boolean,


    dbUsers: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        group: number;
    }[]

    // * Component variables
    loadingText: string



}

class AdminPanel extends Component<any, CustomTypes> {
    constructor(props: any) {
        super(props);
        this.state = {
            // * Component controllers
            loading: false,

            //* database varriables
            dbUsers: [],

            // * Component variables
            loadingText: "",


        };
        this.handleLoader = this.handleLoader.bind(this);

    }

    async componentDidMount() {
        this.handleLoader("Getting users")
        const dbUsers: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            group: number;
        }[] = await APICalls.getAllUsers()
        this.handleLoader("All done")
        this.setState(
            {
                dbUsers: dbUsers,
                loading: false
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
                    <Container>
                        <h1>Admin</h1>
                        <Form>
                            <Form.Group controlId="search">
                                <Form.Label>Search Users</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter search query"

                                />
                            </Form.Group>
                        </Form>
                        <Table striped bordered hover>
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
                                {this.state.dbUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.email}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.group}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </LoadingOverlay>
            </>
        );
    }
}

export default AdminPanel;