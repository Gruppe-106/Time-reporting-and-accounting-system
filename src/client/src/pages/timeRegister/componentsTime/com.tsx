import {Container, Table, Form, InputGroup, Button} from "react-bootstrap";
import React, {Component} from "react";

interface TimeTable{
    bTableRows:TimeTableBRow[]
}

interface TimeTableBRow{
    projectName:string
    taskName:string
}

class TimeTableRegister extends Component<TimeTable> {
    bTableRows:TimeTableBRow[]
    constructor(props:TimeTable) {
        super(props);

        this.bTableRows = props.bTableRows;
    }

    private generateTable():JSX.Element {
        let arr = ['1', '2', '3', '4', '5', '6', '7'];
        return (
            <>
            <Form>
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
                <tr><th colSpan={2}>Total Time:</th></tr>
                </tbody>
                </Table>
                <Button variant="primary" type="button" onClick={() => this.generateTableRow()}>Add row</Button>
            </Form>
            </>
        )
    }

    private generateTableRow():JSX.Element[] {
        return this.bTableRows.map((row) =>{
            let arr = ['1', '2', '3', '4', '5', '6', '7'];
            return (<tr>
                        <td>{row.projectName}</td>
                        <td>{row.taskName}</td>
                        {arr.map(
                        (num) => (
                        <td><InputGroup size="sm">
                            <Form.Control type="number" placeholder="0" />
                            <InputGroup.Text id={`basic-addon-${num}`}>;</InputGroup.Text>
                            <Form.Select>
                                <option value="0">0</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="45">45</option>
                            </Form.Select>
                        </InputGroup></td>))}
                        <td>0</td> {/* Total time */}
                    </tr>)
        })
    }

    render() {
        return(
            <Container>
                {this.generateTable()}
            </Container>
        )
    }
}

export default TimeTableRegister


/*
let arr = ['1', '2', '3', '4', '5', '6', '7'];

<Form>
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
                    <Form.Select>
                        <option value="0">0</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                    </Form.Select>
                </InputGroup></td>))}
                <td>0</td> 
                </tr>
                <tr><th colSpan={2}>Total Time:</th></tr>
                </tbody>
                </Table>
                <Button variant="primary" type="button" onClick={() => this.generateTableRow()}>Add row</Button>
            </Form> */