import React, { Component } from 'react';
import {Container, Table, Form, InputGroup, Button} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
// Empty prop to indicate that the component will not receive a prop.
interface EmptyProps {}

class TableHeader extends React.Component<any> {

    render() {
        return (
            <thead>
            <tr>
                <th>Task Name</th>
                <th>Project Member</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Time Type</th>
                <th>&#128465;</th> {/* Trashcan, HTML Entity: */}
            </tr>
            </thead>
        );
    }
}

interface TaskCreateData {
    taskName:string
    member:string
}

interface Api{
    status:number
    data : {
        id?: number,
        email?: string,
        firstName?: string,
        lastName?: string,
        groupId?: number
    }
}

interface TaskCreateState {
    data: TaskCreateData[];
}
interface TaskCreateRowProps {
    data: TaskCreateData;
    onDelete: () => void
}

interface TaskCreateRowState {
    times: string[];
    total: number;
    minTotal: number;
}

// Creating a tablerow for the table body, takes in 2 props, data and onDelete
class TaskCreateRow extends Component<TaskCreateRowProps> {
    /**
     * @description When this method is called, it extracts the onDelete prop from this.props and invokes it.
     */
    handleDeleteClick = () => {
        const { onDelete } = this.props;
        //  onDelete function passed in as a prop, deletes corresponding time sheet row
        onDelete();
    };

     state = {
        tableRows: [ {
            id: -1,
            email: "",
            firstName: "",
            lastName: "",
            groupId: -1
        } ]
    }

    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler();
        //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
        //Callbacks can be used to tell what to do with the data once it's been retrieved
        apiHandler.get(`/api/user/get?ids=*`,{}, (value) => {
            console.log(value)
            //Then convert the string to the expected object(eg. )
            let json:Api = JSON.parse(JSON.stringify(value))
            //Then update states or variables or whatever you want with the information
            this.setState({tableRows: json})
            console.log(json)
        })
    }

    render() {
        return (
            <tr>
                <td><InputGroup size="sm">
                    <Form.Control
                        type="text"
                        placeholder="Task 1"
                        id="task"
                    />
                </InputGroup></td>
                <td><InputGroup size="sm">
                    <Form.Select>
                        <Form.Control
                            type="text"
                            placeholder="John Doe"
                            id="member"
                        />
                        <option>bruh</option>
                    </Form.Select>
                </InputGroup></td>
                <td><InputGroup size="sm">
                    <Form.Control
                        type="date"
                        placeholder="Task 1"
                        id="startDate"
                    />
                </InputGroup></td>
                <td><InputGroup size="sm">
                    <Form.Control
                        type="date"
                        placeholder="Task 1"
                        id="endDate"
                    />
                </InputGroup></td>
                <td><InputGroup size="sm">
                    <Form.Control
                        type="number"
                        placeholder="1"
                        id="timeType"
                    />
                </InputGroup></td>
                <td>
                    <Button variant="danger" type="button" onClick={this.handleDeleteClick}>-</Button>
                </td>
            </tr>
        )
    }
}

class ProjectCreateTask extends Component<EmptyProps, TaskCreateState> {
    constructor(props: EmptyProps) {
        super(props);

        this.state = {
            data: [],
        };

        this.handleAddRow = this.handleAddRow.bind(this);
    }

    /**
     * @description First, the current state's data array is destructured from this.state. This array is then sliced to remove the element at the specified index using the spread operator (...) to create a new array. This new array is then used to update the component's state using the setState method.
     The setState method is a built-in React method that updates the component's state and triggers a re-render of the component. It takes an object as an argument that represents the new state of the component. In this case, the data property in the state object is updated with the new array that was created by removing the element at the specified index.
     The spread operator is used to create a new array from the original data array in the state object because React requires that state be updated immutably. That is, the original state should not be modified directly, but instead a new copy of the state should be created with the necessary changes.

     This method is used to delete a row from the data array in the component's state when called, triggering a re-render of the component with the updated state.
     * @param index : number, which represents the index of the row that needs to be deleted from the data array in the component's state.
     */
    handleDeleteRow = (index: number) => {
        const { data } = this.state;

        this.setState({
            data: [...data.slice(0, index), ...data.slice(index + 1)],
        });
    };

    /**
     * @description First, the current state's data array is destructured from this.state. This array is then copied using the spread operator (...) and a new object representing the new row is added to the end of the array. The new row object contains default values for projectName and taskName.
     */
    handleAddRow() {
        const { data } = this.state;

        this.setState({
            data: [
                ...data,
                {taskName: "New task", member:"John Doe"},
            ],
        });
    }
    /**
     * It is used to generate an array of TaskCreateRow components based on the data array in the component's state.
     * @returns class component. <TaskCreateRow>
     */

    renderRows() {
        const { data } = this.state;

        return data.map((item, index) => (
            <TaskCreateRow key={index} data={item} onDelete={() => this.handleDeleteRow(index)}/>
        ));
    }

    render() {
        return (
            <Container fluid="sm">
                <Table bordered size="sm">
                    <TableHeader />
                    <tbody>
                    {this.renderRows()}
                    </tbody>
                </Table>
                <Button variant="primary" type="button" onClick={() => this.handleAddRow()}>Add Task</Button>
            </Container>
        );
    }
}

export default ProjectCreateTask