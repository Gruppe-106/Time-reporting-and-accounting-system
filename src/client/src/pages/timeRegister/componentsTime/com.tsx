import {Container, Table, Form, Dropdown, DropdownButton, InputGroup} from "react-bootstrap";
import React, {Component} from "react";

class TimeTableRegister extends Component<any> {

    state = {valueChange: false};
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
                    {arr.map((num) => (<th>{num} Date</th>))}
                    <th>Total Time</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <td>ExampleProject</td>
                <td>ExampleTask</td>
                {arr.map(
                (num) => (
                <td><InputGroup size="sm">
                    <Form.Control type="number" placeholder="0" />
                    <InputGroup.Text id={`basic-addon-${num}`}>;</InputGroup.Text>
                    <DropdownButton
                    variant="outline-secondary"
                    title="0"
                    drop="down-centered"
                    id={`time-input-${num}`}
                    align="end"
                    >
                    <Dropdown.Item value={15}>15</Dropdown.Item>
                    <Dropdown.Item value={30}>30</Dropdown.Item>
                    <Dropdown.Item value={45}>45</Dropdown.Item>
                    </DropdownButton>
                </InputGroup></td>))}
                <td>0</td> {/* Total time */}
                </tr>
                <tr><th colSpan={2}>Total Time:</th></tr>
                </tbody>
                </Table>
            </Container>
        )
    }
}

export default TimeTableRegister