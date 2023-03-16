import {Container, Table, Form, InputGroup, Dropdown, DropdownButton} from "react-bootstrap";
import React, {Component} from "react";

type MyState = {
    DropValue?: number; // like this
  };

class TimeTableRegister extends Component<MyState> {
    constructor(props:MyState) {
        super(props);
    }    
    state: MyState = {DropValue: 0,};

    render() {
        let arr = ['1', '2', '3', '4', '5', '6', '7'];
        let iniDropValue = this.state.DropValue;
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
                    title={iniDropValue}
                    drop="down-centered"
                    id={`time-input-${num}`}
                    align="end"
                    onSelect={(selectedKey) => this.setState({iniDropValue: selectedKey})}
                    >
                    <Dropdown.Item eventKey={15} value={15}>15</Dropdown.Item>
                    <Dropdown.Item eventKey={30} value={30}>30</Dropdown.Item>
                    <Dropdown.Item eventKey={45} value={45}>45</Dropdown.Item>
                    </DropdownButton>
                    {/*<Form.Select>
                        <option value="0">0</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                    </Form.Select> */}
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