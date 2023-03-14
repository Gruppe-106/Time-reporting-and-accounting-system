import {Container, Table, Form} from "react-bootstrap";
import React, {Component} from "react";

interface TimeTableProp{
    tableRows:TimeTableRow[]
}

interface TimeTableRow{
    projectName:string
    taskName:string
    totalTime:number
}

class TimeTableRegister extends Component<TimeTableProp> {
    tableRows:TimeTableRow[];

    constructor(props:TimeTableProp) {
        super(props);
        this.tableRows = props.tableRows;
    }

    private tableRender():JSX.Element[]{
        return this.tableRows.map((row) =>{

            return (<tr><td>{row.projectName}</td>
                        <td>{row.taskName}</td>
                        <td><Form><Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Control type="number" placeholder="Time in hours" />
                        </Form.Group></Form></td>
                        <td><Form><Form.Group controlId="exampleForm.ControlInput2">
                            <Form.Control type="number" placeholder="Time in hours" />
                        </Form.Group></Form></td>
                        <td><Form><Form.Group controlId="exampleForm.ControlInput3">
                            <Form.Control type="number" placeholder="Time in hours" />
                        </Form.Group></Form></td>
                        <td><Form><Form.Group controlId="exampleForm.ControlInput4">
                            <Form.Control type="number" placeholder="Time in hours" />
                        </Form.Group></Form></td>
                        <td><Form><Form.Group controlId="exampleForm.ControlInput5">
                            <Form.Control type="number" placeholder="Time in hours" />
                        </Form.Group></Form></td>
                        <td><Form><Form.Group controlId="exampleForm.ControlInput6">
                            <Form.Control type="number" placeholder="Time in hours" />
                        </Form.Group></Form></td>
                        <td><Form><Form.Group controlId="exampleForm.ControlInput7">
                            <Form.Control type="number" placeholder="Time in hours" />
                        </Form.Group></Form></td>
                        <td>{row.totalTime}</td>
                    </tr>)
        })
    }

    render() {
        return(
            <Container>
                <Table bordered hover size="sm">
                <thead>
                <tr>
                    <th>Project Name</th>
                    <th>Task Name</th>
                    <th>1 Date</th>
                    <th>2 Date</th>
                    <th>3 Date</th>
                    <th>4 Date</th>
                    <th>5 Date</th>
                    <th>6 Date</th>
                    <th>7 Date</th>
                    <th>Total Time</th>
                </tr>
                </thead>
                <tbody>
                {this.tableRender()}
                <tr><td colSpan={2}>Total Time:</td></tr>
                </tbody>
                </Table>
            </Container>
        )
    }
}

export default TimeTableRegister