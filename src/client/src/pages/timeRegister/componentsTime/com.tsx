import React, { Component } from 'react';
import {Container, Table, Form, InputGroup, Button} from "react-bootstrap";

interface TableHeaderProps {}

interface TableHeaderState {
  dates: string[];
}

class TableHeader extends React.Component<TableHeaderProps, TableHeaderState> {
  constructor(props: TableHeaderProps) {
    super(props);

    // Get the current date
    const today = new Date();

    // Get the start date of the current week (Sunday)
    const sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);

    // Create an array of date strings for each day of the week
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i);
      dates.push(currentDate.toLocaleDateString());
    }

    // Set the initial state
    this.state = {
      dates: dates,
    };
  }

  render() {
    return (
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Task Name</th>
              {this.state.dates.map((date, index) => (
                <th key={index}>{date}</th>
              ))}
              <th>Total Time</th>
            </tr>
          </thead> 
    );
  }
}

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
    return (
      <Container fluid>
        <Table bordered size="sm">
            <TableHeader />
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