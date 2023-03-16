import React, { Component } from 'react';
import {Container, Table, Form, InputGroup, Button} from "react-bootstrap";

interface TimeSheetData {
    projectName:string
    taskName:string
}

interface Props {}

interface TimeSheetState {
  data: TimeSheetData[];
}

class TimeSheetRow extends Component<{ data: TimeSheetData; onDelete: () => void }> {
  handleDeleteClick = () => {
    const { onDelete } = this.props;

    onDelete();
  };
  
    render() {
        const { data } = this.props;
        let arr = ['1', '2', '3', '4', '5', '6', '7'];
        return (
            <tr>
                <td>{data.projectName}</td>
                        <td>{data.taskName}</td>
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
                        <td>
                        <Button variant="danger" type="button" onClick={this.handleDeleteClick}>-</Button>
                        </td>
            </tr>
        )
    }
}

class TimeSheet extends Component<Props, TimeSheetState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: [
        {projectName: "test", taskName: "test"},
        {projectName: "test2", taskName: "test2"},
      ],
    };

    this.handleAddRow = this.handleAddRow.bind(this);
  }

  handleDeleteRow = (index: number) => {
    const { data } = this.state;

    this.setState({
      data: [...data.slice(0, index), ...data.slice(index + 1)],
    });
  };

  handleAddRow() {
    const { data } = this.state;

    this.setState({
      data: [
        ...data,
        { projectName: "New project", taskName: "New task" },
      ],
    });
  }

  renderRows() {
    const { data } = this.state;

    return data.map((item, index) => (
      <TimeSheetRow key={index} data={item} onDelete={() => this.handleDeleteRow(index)} />
    ));
  }

  render() {
    let arr = ['1', '2', '3', '4', '5', '6', '7'];
    return (
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
                {this.renderRows()}
            </tbody>
        </Table>
        <Button variant="primary" type="button" onClick={() => this.handleAddRow()}>Add Row</Button>
      </Container>
    );
  }
}

export default TimeSheet