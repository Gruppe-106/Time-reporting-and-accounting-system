import {Container, Table, Form, Dropdown, DropdownButton, InputGroup} from "react-bootstrap";
import React, {Component} from "react";

class TimeTableRegister extends Component<any> {
    constructor(props:any) {
        super(props);
    }

    render() {
        let arr = ['1', '2', '3', '4', '5', '6', '7'];
        return(
            <Container>
                <Table bordered hover size="sm">
                <thead>
                <tr>
                    <th>Project Name</th>
                    <th>Task Name</th>
                    {arr.map((va) => (<th>{va} Date</th>))}
                    <th>Total Time</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <td>ExampleProject</td>
                <td>ExampleTask</td>
                {arr.map(
                (value) => (
                <td><InputGroup>
                    <Form.Control type="number" placeholder="0" />
                    <DropdownButton
                    variant="secondary"
                    title="0"
                    id={`time-input-${value}`}
                    align="end"
                    >
                    <Dropdown.Item eventKey={1}>15</Dropdown.Item>
                    <Dropdown.Item eventKey={2}>30</Dropdown.Item>
                    <Dropdown.Item eventKey={3}>45</Dropdown.Item>
                    <Dropdown.Item eventKey={4}>60</Dropdown.Item>
                    </DropdownButton>
                </InputGroup></td>))}
                <td>0</td>
                </tr>
                <tr><th colSpan={2}>Total Time:</th></tr>
                </tbody>
                </Table>
            </Container>
        )
    }
}

export default TimeTableRegister