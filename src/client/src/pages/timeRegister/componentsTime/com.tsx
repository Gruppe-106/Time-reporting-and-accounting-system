import React, { Component } from 'react';
import {Container, Table, Form, InputGroup, Button} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";

// Empty prop to indicate that the component will not recive a prop.
interface EmptyProps {}

interface TableHeaderState {
  dates: string[];
}

class TableHeader extends React.Component<EmptyProps, TableHeaderState> {
  constructor(props: EmptyProps) {
    super(props);

    // Get the current date
    const today = new Date();

    // Get the start date of the current week (Monday)
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);

    // Create an array of date strings for each day of the week
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
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
              {/* Gets the dates, and maps each date with an index to a table header, creating 7 <th>, all dates in a week */}
              {this.state.dates.map((date, index) => (
                <th key={index}>{date}</th>
              ))}
              <th>Total Time</th>
              <th>&#128465;</th> {/* Trashcan, HTML Entity: */}
            </tr>
          </thead> 
    );
  }
}

interface TimeSheetData {
    projectName:string
    taskName:string
}

interface TimeSheetState {
  data: TimeSheetData[];
}
// Creating a tablerow for the table body, takes in 2 props, data and onDelete
class TimeSheetRow extends Component<{ data: TimeSheetData; onDelete: () => void }> {
  // When this method is called, it extracts the onDelete prop from this.props and invokes it.
  handleDeleteClick = () => {
    const { onDelete } = this.props;
    // onDelete function passed in as a prop, delets corresponding time sheet row
    onDelete();
  };
  
    render() {
        // Defining data as this.prop, it reprensents the data (prop) passed to TimeSheetRow
        const { data } = this.props;
        // arr to create a input field for all 7 dates
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

class TimeSheet extends Component<EmptyProps, TimeSheetState> {
  constructor(props: EmptyProps) {
    super(props);

    this.state = {
      data: [],
    };

    this.handleAddRow = this.handleAddRow.bind(this);
  }
  // apiHandler to get data from "database", the data is passed to the data array
  componentDidMount() {
    let apiHandler = new BaseApiHandler("fuldstændigligemeget");
    apiHandler.get(
      `api/time/register/get?user=1&var=taskName,taskId,projectName`,
      (value) => {
        let json: TimeSheetData[] = JSON.parse(JSON.stringify(value));
        this.setState({data: json});
      }
    );
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
        { projectName: "New project", taskName: "New task" },
      ],
    });
  }
  /**
   * It is used to generate an array of TimeSheetRow components based on the data array in the component's state.
   * @returns class component. <TimeSheetRow>
   */
  renderRows() {
    const { data } = this.state;

    return data.map((item, index) => (
      <TimeSheetRow key={index} data={item} onDelete={() => this.handleDeleteRow(index)} />
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
        <Button variant="primary" type="button" onClick={() => this.handleAddRow()}>Add Row</Button>
      </Container>
    );
  }
}

export default TimeSheet