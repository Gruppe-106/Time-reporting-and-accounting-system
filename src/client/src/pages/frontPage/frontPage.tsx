import React, { Component } from "react";
import BaseNavBar from "../../components/navBar";
import { Button, Container, Table } from "react-bootstrap";
import BaseApiHandler from "../../network/baseApiHandler";
import LoadingOverlay from 'react-loading-overlay-ts';
import { userInfo } from "../../utility/router";
import APICalls from "../adminPanel/utility/apiCalls";
import Form from 'react-bootstrap/Form';


interface User {
    email: string,
    firstName: string,
    lastName: string,
    id: number,
    groupId: number
}


interface Tasks {
    projectId: number,
    projectName: string,
    taskId: number,
    taskName: string
}

/**
 * Custom types
 */
interface CustomTypes {

    //Database
    user: User
    tasks: Tasks[]

    // * Controlling components
    loading: boolean

    // * Component variables
    loadingText: string
    searchQuery: string

}


class FrontPage extends Component<any, CustomTypes> {

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
        await new BaseApiHandler().get("/api/task/get?ids=1", {}, (value) => {
            console.log(value)
        });
        this.handleLoader("Getting user info")
        const user: User = (await APICalls.getUser(userInfo.userId)).data[0]

        this.handleLoader("Getting tasks")
        const tasks: Tasks[] = (await APICalls.getTasks(userInfo.userId)).data

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

                    <Container style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}} >
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
                                {this.state.tasks.filter((task:Tasks) =>
                                    task.taskId.toString().trim().toLowerCase().includes(this.state.searchQuery.trim()) ||
                                    task.taskName.toLowerCase().trim().includes(this.state.searchQuery.trim()) ||
                                    task.projectId.toString().trim().toLowerCase().includes(this.state.searchQuery.trim()) ||
                                    task.projectName.toString().trim().toLowerCase().includes(this.state.searchQuery.trim()) 

                                ).map((user) => this.renderRow(user))}
                            </tbody>

                        </Table>

                    </Container>
                </LoadingOverlay>
            </>
        );
    }

}

export default FrontPage;