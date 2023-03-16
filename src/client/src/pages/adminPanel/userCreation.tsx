/*
    Form for creating new users
 */
import React, { Component } from "react";
import BaseNavBar from "../../components/navBar";
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Typeahead, Highlighter } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import forge from 'node-forge';


//TODO: fixings the types as this is infact a no no but it does fix it
interface CostumTypes {
    selectedRoles: any[],
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    assignedToManager: { id: number, name: string } | null,
    dbRoles: any[],
    firstNameValid: boolean,
    lastNameValid: boolean,
    emailValid: boolean,
    passwordValid: boolean,
    rolesValid: boolean,
    submitDisabled: boolean,

}

class GetCreationData {

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
}



class UserCreation extends Component<any, CostumTypes>{
    constructor(props: any) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            assignedToManager: null,
            selectedRoles: [],
            dbRoles: [],

            firstNameValid: false,
            lastNameValid: false,
            emailValid: false,
            passwordValid: false,
            rolesValid: false,
            submitDisabled: true,

        }
        this.HandleSubmit = this.HandleSubmit.bind(this);
        this.HandleFirstName = this.HandleFirstName.bind(this);
        this.HandleLastName = this.HandleLastName.bind(this);
        this.HandleEmail = this.HandleEmail.bind(this);
        this.HandlePassword = this.HandlePassword.bind(this)
        this.HandleRoles = this.HandleRoles.bind(this)
        this.HandleManager = this.HandleManager.bind(this)
        this.test = this.test.bind(this)
    }

    async componentDidMount() {
        const dbRoles = await GetCreationData.GetAllRoles()

        this.setState({
            dbRoles: dbRoles
        })

    }



    //TODO: find the types or else i commit the no monster day


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
     * Handles changes to the assigned to manager checkbox field.
     * @param manager - The manager object.
     */
    private HandleManager(manager: any): void {
        this.setState({
            assignedToManager: manager[0]
        })
    }

    /**
     * Handles the form submission.
     */
    private HandleSubmit() {
        const sha256 = forge.md.sha256.create();

        const userObject: {
            firstName: string,
            lastName: string,
            email: string,
            password: string,
            assignedToManager: { id: number, name: string } | null
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


    // Test binding for testing because haha funnyman i wanna die
    private test() {
        let submitValid = this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid && this.state.passwordValid && this.state.rolesValid
        console.log(submitValid)
    }






    render() {

        return (
            <>
                <BaseNavBar />
                <Container>
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
                                labelKey="name"
                                options={[
                                    { id: 1, name: "Andreas F-KLUB villan origin story" },
                                    { id: 2, name: "Mads OG Mads the one Mads" },
                                    { id: 3, name: "Mikkel Cykkelmyggen" },
                                    { id: 5, name: "Name's Bond, Christian Bond" },
                                    { id: 6, name: "Mads gone like the wind" },
                                    { id: 7, name: "Simon Simon Simon" },
                                    { id: 4, name: "Alexander 👌" },
                                ]}
                                placeholder="Choose Manager..."
                                onChange={this.HandleManager}
                                filterBy={(option: any, props: any): boolean => {
                                    const query: string = props.text.toLowerCase().trim();
                                    const name: string = option.name.toLowerCase();
                                    const id: string = option.id.toString();
                                    return name.includes(query) || id.includes(query);
                                }}
                                renderMenuItemChildren={(option: any, props: any) => (
                                    <>
                                        <Highlighter search={props.text}>
                                            {option.name}
                                        </Highlighter>
                                        <div>
                                            <small>Manager id: {option.id}</small>
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
                </Container>
            </>
        );
    }


    /**
     * Handles the sending of the user object to server
     * @param UserObject
     */
    private SendUser(UserObject: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        assignedToManager: { id: number, name: string } | null
        roles: any[]
    }) {

        console.log(UserObject)

    }
}



export default UserCreation;
