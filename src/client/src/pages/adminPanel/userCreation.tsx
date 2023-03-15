/*
    Form for creating new users
 */
import React, { Component} from "react";
import BaseNavBar from "../../components/navBar";
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

//TODO: fixings the types as this is infact a no no
interface CostumTypes {
    selectedRoles: any[],
    firstName: string,
    lastName: string,
    email:string,
    assignedToManager: {id:number, label: string}
}

class UserCreation extends Component<any, CostumTypes>{
    constructor(props: any) {
        super(props);
        this.state = {
            selectedRoles: [],
            firstName: "",
            lastName: "",
            email: "",
            assignedToManager: {"id":Infinity,"label":""}

        }
        this.HandleSubmit = this.HandleSubmit.bind(this);
    }


    private HandleSubmit(){
        console.log(this.state.selectedRoles)
    }

    render() {

        return (
            <>
                <BaseNavBar />
                <Container>
                    <h1>User Creation</h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter first name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter last name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>

                        {/* TODO: create a search bar instead so you can search for the manager*/}
                        <Form.Group className="mb-3" controlId="formBasicAssignToGroupManager">
                            <Form.Label>Assign to group manager</Form.Label>
                            <Form.Select aria-label="Select Project">
                                <option>Peter Neils ole den 7</option>
                                <option>Bob</option>
                                <option>Bent</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicAssignRole">
                            <Form.Label>Assign Roles</Form.Label>
                            <Typeahead
                                id="assignRoles"
                                multiple
                                options={[
                                    { value: 1, label: "Admin" },
                                    { value: 2, label: "Code monkey" },
                                    { value: 3, label: "Group manager" },
                                    { value: 4, label: "Slave" }
                                ]}
                                placeholder="Choose roles..."
                                onChange={(selectedRoles) => {
                                    this.setState({ selectedRoles });
                                }}


                            />
                        </Form.Group>



                        <Button variant="primary" type="button" onClick={this.HandleSubmit}>
                            Submit
                        </Button>
                    </Form>
                </Container>
            </>
        );
    }
}

export default UserCreation;
