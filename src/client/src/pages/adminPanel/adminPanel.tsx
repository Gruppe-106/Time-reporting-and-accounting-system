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
import { Container, Modal } from "react-bootstrap";
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
    // * Input variables
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    password: string | null,
    assignedToManager: { roleName: string, roleId: number, userId: number, firstName: string, lastName: string } | null,
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

    // * Component variables
    popupMessage: string,
    popupTitle: string,
    loadingText: string

}

class AdminPanel extends Component<any,CustomTypes>{
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <><LoadingOverlay
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
                </Container>

            </LoadingOverlay>
            </>
        );
    }
}

export default AdminPanel;