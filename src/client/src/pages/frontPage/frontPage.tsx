import React, { Component } from "react";
import BaseNavBar from "../../components/navBar";
import { Container, Table } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay-ts';
import { userInfo } from "../../utility/router";
import APICalls from "../adminPanel/utility/apiCalls";
import Form from 'react-bootstrap/Form';

import type { User, Tasks, StateTypes } from "./frontPageTypes"


class FrontPage extends Component<any, StateTypes> {

    constructor(props: any) {
        super(props);
        this.state = {
            //Database
            user: {
                firstName: "",
                lastName: "",
                email: "",
                id: Infinity,
                groupId: Infinity
            },
            tasks: [],

            // * Component controllers
            loading: false,


            // * Component varriables
            loadingText: "",
            searchQuery: "",


        };

        this.handleLoader = this.handleLoader.bind(this);

    }

    async componentDidMount(): Promise<void> {
        this.handleLoader("Getting user info")

        const user: User = await APICalls.getUser<User>(userInfo.userId)

        this.handleLoader("Getting tasks")
        const tasks: Tasks[] = await APICalls.getTasks<Tasks[]>(userInfo.userId)

        this.handleLoader("All done")
        this.setState(
            {
                tasks,
                user,
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

    /**
     * Renders the rows of the task table
     * @param task The task object
     * @returns an JSX element or undefined
     */
    private renderRow(task: Tasks): JSX.Element | undefined {

        return (
            <tr style={{ textAlign: "center" }} key={task.taskId}>
                <td>{task.taskId}</td>
                <td>{task.taskName}</td>
                <td>{task.projectId}</td>
                <td>{task.projectName}</td>
            </tr>
        );
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

                    <Container style={{paddingTop: "10px"}} >
                        <div style={{ justifyContent: "center", display: "flex" }}>
                            <h1>Welcome {this.state.user.firstName + " " + this.state.user.lastName}</h1>
                        </div>
                        <Form>
                            <Form.Group className="mb-3" controlId="search">
                                <Form.Label>Search tasks</Form.Label>
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
                                    <th>Task Id</th>
                                    <th>Task Name</th>
                                    <th>Project Id</th>
                                    <th>Project Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.tasks.filter((task: Tasks) =>
                                    task.taskId.toString().trim().toLowerCase().includes(this.state.searchQuery.trim()) ||
                                    task.taskName.toLowerCase().trim().includes(this.state.searchQuery.trim()) ||
                                    task.projectId.toString().trim().toLowerCase().includes(this.state.searchQuery.trim()) ||
                                    task.projectName.toString().trim().toLowerCase().includes(this.state.searchQuery.trim())

                                ).map((userTask:Tasks) => this.renderRow(userTask))}
                            </tbody>

                        </Table>

                    </Container>
                </LoadingOverlay>
            </>
        );
    }

}

export default FrontPage;