import React, { Component } from 'react';
import {Container, Table, Form, InputGroup, Button, Modal} from "react-bootstrap";
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead';
import BaseApiHandler from "../../../network/baseApiHandler";

interface Api{
  status:number,
  data: TimeSheetRowData[]
}

/*

    * TODO:
      * Fix add row (with popup modal) (have pop up, but fix loading of data so only data(rows) with time is loaded)
      * Only render table row if there is time for said table, otherwise be able to create a row for that task.
      * Show TimeSheet for different users (Working)
      * Load "time" and "date" form data to timeSheet (done, but have to fix data , and how and where data is loaded)
      * Submit button (Post data)
      * Clean up code

*/


/*

       * Utility

*/
class Utility {
  public static getCurrentWeekDates(dates:string[]){
    // Get the current date
  const today = new Date();

  // Get the start date of the current week (Monday)
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
  
  dates.push(Utility.makeDateFromNum(1679356800000));

  // Create an array of date strings for each day of the week
  for (let i = 1; i < 7; i++) {
    const currentDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    dates.push(currentDate.toLocaleDateString());
  }
  return dates;
  }

  public static makeDateFromNum(date:number){
    const newDate = new Date(date);

    const secNewDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDay());
    
    return secNewDate.toLocaleDateString();
  }

  public static makeDateFromString(date:string){
    const newDate = new Date(Number(date));

    const secNewDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDay());
    
    return secNewDate.toLocaleDateString();
  }
}

// Empty prop to indicate that the component will not recive a prop.
interface EmptyProps {}

interface TableHeaderState {
  headerDates: string[];
}

/*

    * Creating the table header

*/ 
class TableHeader extends React.Component<EmptyProps, TableHeaderState> {
  constructor(props: EmptyProps) {
    super(props);

    const dates: string[] = [];

    // Set the initial state
    this.state = {
      headerDates: Utility.getCurrentWeekDates(dates),
    };
  }

  render() {
    return (
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Task Name</th>
              {/* Gets the dates, and maps each date with an index to a table header, creating 7 <th>, all dates in a week */}
              {this.state.headerDates.map((date, index) => (
                <th key={index}>{date}</th>
              ))}
              <th>Total Time</th>
              <th>&#128465;</th> {/* Trashcan, HTML Entity: */}
            </tr>
          </thead> 
    );
  }
}

// Loaded data from database, used in TimeSheetRow and TimeSheetPage
interface TimeSheetRowData {
    projectName:string;
    taskName:string;
    time:number;
    date:number;
}

// The props given to TimeSheetRow
interface TimeSheetRowProps {
  data: TimeSheetRowData; 
  onDelete: () => void
}

// State of variables in TimeSheetRow
interface TimeSheetRowState {
  dataTotal: number;
  times: string[];
  total: number;
  minTimes: string[];
  minTotal: number;
  showDeleteRowModal: boolean;
}

/*

    * Creating a tablerow for the table body, takes in 2 props, data and onDelete

*/
class TimeSheetRow extends Component<TimeSheetRowProps, TimeSheetRowState> {
  // Inilisie all states
  state: TimeSheetRowState = {
    dataTotal: this.props.data.time,
    times: ["0", "0", "0", "0", "0", "0", "0"],
    total: 0,
    minTimes: ["0", "0", "0", "0", "0", "0", "0"],
    minTotal: 0,
    showDeleteRowModal: false,
  };

  /*
      * Closes the modal 
   */
  private handleCloseModal = () => {
    this.setState({ showDeleteRowModal: false });
  };

  /*
      * Opens the modal
   */
  private handleShowModal = () => {
    this.setState({ showDeleteRowModal: true });
  };

  /*
      * Calles the onDelete function/method, and then closes the modal 
   */
  private handleDeleteClick = () => {
    const { onDelete } = this.props;
    onDelete();
    this.handleCloseModal();
  };

  /**
   * This method is used to handle changes to a set of Form.controls, 
   * making sure the values entered are valid (not under 0) and updating the component's state with the new values.
   * @param index : The index is used to identify which Form.control has been changed
   * @param value : The value is the new value of that Form.control.
   */

  private handleControlTimeChange = (index: number, value: string) => {
    const { times } = this.state;
    const newValue = parseInt(value) < 0 ? "0" : value; // prevent negative values
    times[index] = newValue;
    const total = 60 * times.reduce((acc, cur) => acc + parseInt(cur), 0); // This line of code is used to calculate the total sum of all the values in the times array, which is then used to update the component's state with the new total time.
    this.setState({ times, total });
  };

  /**
   * This method is used to handle changes to a form.select,
   * 
   * @param index : The index is used to identify which Form.select has been changed
   * @param value : The value is the new value of that Form.select.
   */
  private handleSelectTimeChange = (index: number, value: string) => {
    const { minTimes } = this.state;
    const newValue = value;
    minTimes[index] = newValue;
    const minTotal = minTimes.reduce((acc, cur) => acc + parseInt(cur), 0);
    this.setState({ minTotal: minTotal });
  };

  /*
      * Calculates total hours and minutes.
   */
  private displayTimeTotal = ():JSX.Element => {
    const { dataTotal } = this.state;
    const { total } = this.state;
    const { minTotal } = this.state;

    let newDataTotal = dataTotal * 60;  

    const totalMinutes = total + minTotal + newDataTotal;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return (
      <p>{hours}:{minutes}</p>
    )
  }

    render() {
        // Defining data as this.prop, it reprensents the data (prop) passed to TimeSheetRow
        const { data } = this.props;
        // Loades the initial state
        const { times, showDeleteRowModal } = this.state;
        // arr to create a input field for all 7 dates
        let arr = ['1', '2', '3', '4', '5', '6', '7'];
        return (
            <tr>
                <td>{data.projectName}</td>
                        <td>{data.taskName}</td>
                        {arr.map((num, index) => (<td key={index}>
                          <InputGroup size="sm">
                            <Form.Control 
                              type="number" 
                              placeholder="0" 
                              value={times[index]}
                              onChange={(e) => this.handleControlTimeChange(index, e.target.value)}
                              />
                            <InputGroup.Text id={`basic-addon-${num}`}>:</InputGroup.Text>
                            <Form.Select onChange={(e) => this.handleSelectTimeChange(index, e.target.value)}>
                                <option value="0">0</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="45">45</option>
                            </Form.Select>
                        </InputGroup></td>))}
                        <td>{this.displayTimeTotal()}</td> {/* Total time */}
                        <td>
                        <Button variant="danger" type="button" onClick={this.handleShowModal}>-</Button>
                        </td>
                        <Modal show={showDeleteRowModal} onHide={this.handleCloseModal}>
                          <Modal.Header closeButton>
                              <Modal.Title>Delete Row?</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                              <p>Are you sure you want to delete:</p>
                              <p>{data.projectName}, {data.taskName} ?</p>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleCloseModal}>
                              Cancel
                            </Button>
                            <Button variant="danger" onClick={this.handleDeleteClick}>
                              Delete
                            </Button>
                          </Modal.Footer>
                        </Modal>
            </tr>
        )
    }
}

// Props used in TimeSheetPage
interface TimeSheetProp {
  userId: number;
}

// Variable states in TimeSheetPage
interface TimeSheetState {
  data: TimeSheetRowData[];
  status:number;
  selectedProject: TimeSheetRowData | null;
  loadedProjects: TimeSheetRowData | null;
  showAddRowModal: boolean;
}

/*

    * Creating the full Timesheet page

*/
class TimeSheetPage extends Component<TimeSheetProp, TimeSheetState> {
  constructor(props: TimeSheetProp) {
    super(props);

    // Initialise states
    this.state = {
      data: [],
      status: 0,
      loadedProjects: null,
      selectedProject: null,
      showAddRowModal: false,
    };

    // Bind (TODO: Add description)
    this.handleAddRow = this.handleAddRow.bind(this);
  }

  /*
      * Closes the modal 
   */
  private handleCloseAddModal = () => {
    this.setState({ showAddRowModal: false });
  };

  /*
      * Opens the modal
   */
  private handleShowAddModal = () => {
    this.setState({ showAddRowModal: true });
  };

  /**
   * Handles delete row click, setting the current values to nothing and there by delting the rows.
   * 
   * First, the current state's data array is destructured from this.state. This array is then sliced to remove the element at the specified index using the spread operator (...) to create a new array. This new array is then used to update the component's state using the setState method.
      The setState method is a built-in React method that updates the component's state and triggers a re-render of the component. It takes an object as an argument that represents the new state of the component. In this case, the data property in the state object is updated with the new array that was created by removing the element at the specified index.
      The spread operator is used to create a new array from the original data array in the state object because React requires that state be updated immutably. That is, the original state should not be modified directly, but instead a new copy of the state should be created with the necessary changes.
      
      This method is used to delete a row from the data array in the component's state when called, triggering a re-render of the component with the updated state.
   * @param index : number, which represents the index of the row that needs to be deleted from the data array in the component's state.
   */
  private handleDeleteRow = (index: number) => {
    const { data } = this.state;

      this.setState({
          data: [...data.slice(0, index), ...data.slice(index + 1)],
        });
  };  

  
  // apiHandler to get data from "database", the data is passed to the data array
  public componentDidMount() {
    const { userId } = this.props;
    let apiHandler = new BaseApiHandler("fuldstændigligemeget");
    apiHandler.get(
      `/api/time/register/get?user=${userId}&var=taskName,taskId,projectName,time,date`,{},
      (value) => {
        let json: Api = JSON.parse(JSON.stringify(value));
        this.setState({data: json.data});
      }
    );
  }

  /**
   * First, the current state's data array is destructured from this.state. This array is then copied using the spread operator (...) and a new object representing the new row is added to the end of the array. The new row object contains default values for projectName and taskName.
   */
  private handleAddRow() {
    const { data, selectedProject } = this.state;
  
    if (!selectedProject) {
      // No project is selected, do not add a new row
      return;
    }
  
    const newProjectName = selectedProject.projectName;
    const newTaskName = selectedProject.taskName;
  
    this.setState({
      data: [
        ...data,
        { projectName: newProjectName, taskName: newTaskName, time: 0, date: 1679356800000 },
      ],
      selectedProject: null, // clear the selectedProject state after adding a new row
    });
  
    this.handleCloseAddModal();
  }
  

  /**
   * It is used to generate an array of TimeSheetRow components based on the data array in the component's state.
   * @returns class component. <TimeSheetRow>
   */
  private renderRows() {
    const { data } = this.state;

    const dates:string[] = [];
    Utility.getCurrentWeekDates(dates);
    
    return data.map((item, index) => {
      if (Utility.makeDateFromNum(item.date) === dates[0]) {
        return <TimeSheetRow key={index} data={item} onDelete={() => this.handleDeleteRow(index)} />;
      } else {
        console.log(dates[0]);
        console.log((item.date).toString());
        console.log("Dates dosent match")
        return null; // if the date dosent match, don't render the row
      }
    });
  }

  render() {
    const { showAddRowModal } = this.state;
    return (
      <Container fluid="sm">
        <Table bordered size="sm">
            <TableHeader />
            <tbody>
                {this.renderRows()}
            </tbody>
        </Table>
        <Button variant="primary" type="button" onClick={() => this.handleShowAddModal()}>Add Row</Button>
        <Modal show={showAddRowModal} onHide={this.handleCloseAddModal}>
        <Modal.Header closeButton>
         <Modal.Title>Add Row?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <p>Which task do you want to add?</p>
         <Form.Group className="mb-3" controlId="formBasicAssignManager">
        <Form.Label>Find project</Form.Label>
          <Typeahead
            id="findProject"
            labelKey={(option: any) => `${option.projectName}  ${option.taskName}`}
            options={this.state.data}
            placeholder="Pick a project"
            filterBy={(option: any, props: any): boolean => {
              const query: string = props.text.toLowerCase().trim();
              const name: string = option.projectName.toLowerCase() + option.taskName.toLowerCase();
              return name.includes(query);
            }}
              renderMenuItemChildren={(option: any, props: any) => (
              <>
                <Highlighter search={props.text}>
                  {option.projectName + ", " + option.taskName}
                </Highlighter>
              </>
            )}
            onChange={(selected: any) => {
              // Set selectedProject state to the first selected option (if any)
              this.setState({ selectedProject: selected[0] || null });
            }}
            selected={this.state.selectedProject ? [this.state.selectedProject] : []}
          />
        </Form.Group>
         </Modal.Body>
         <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseAddModal}>Cancel</Button>
          <Button variant="primary" onClick={this.handleAddRow}>Add</Button>
         </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

// State of UserTimeSheet
interface UserState {
  userId: number;
}

class UserTimeSheet extends Component<EmptyProps, UserState> {
  constructor(props: EmptyProps) {
    super(props);

    this.state = {
      userId: 0,
    };
  }

  private handleSelectChange(value:string) {
    const newId = parseInt(value);
    this.setState({ userId: newId });
  }

  private renderTimeSheet() {
    const { userId } = this.state;
    const selectedUser = userId;

    if (selectedUser > 0) {
      return <TimeSheetPage key={selectedUser} userId={selectedUser} />;
    }
  }  

  render() {
    return (
      <Container fluid="sm">
        <Form.Select onChange={(e) => this.handleSelectChange(e.target.value)}>
          <option>Select user</option>
          <option value={1}>One</option>
          <option value={2}>Two</option>
          <option value={3}>Three</option>
          <option value={4}>Four</option>
          <option value={5}>Five</option>
          <option value={6}>Six</option>
          <option value={7}>Seven</option>
          <option value={8}>Eight</option>
          <option value={9}>Nine</option>
          <option value={10}>Ten</option>
        </Form.Select>
        {this.renderTimeSheet()}
      </Container>
    );
  }
}

export default UserTimeSheet;