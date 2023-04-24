import React, { Component } from 'react';
import { Container, Table, Form, InputGroup, Button, ButtonGroup, Modal } from "react-bootstrap";
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead';
import BaseApiHandler from "../../../network/baseApiHandler";
import { getCurrentWeekDates, dateStringFormatter, dateToNumber } from "../../../utility/timeConverter"
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
//All interfaces for user component
import { Api, AddModalApi, TaskRowData, TimeSheetData, TimeSheetProp, TimeSheetState } from "./interfaces"

type NumberWithBoolean = [number, boolean];

/*

    * TODO: User timeSheet
    * 

*/

/*

    * Creating the full Timesheet page

*/
class TimeSheetPage extends Component<TimeSheetProp, TimeSheetState> {
  constructor(props: TimeSheetProp) {
    super(props);

    // Initialise states
    this.state = {
      stateRowData: new Map<number, TaskRowData>(),
      prevRowSubmitData: [],
      searchDataState: [],
      deletedItems: [],
      selectedProject: {
        taskId: Infinity,
        taskName: "",
        projectId: Infinity,
        projectName: "",
      },
      offsetState: 0,
      isUpdating: false,
      showAddRowModal: false,
      headerDates: [],
      times: [0, 0, 0, 0, 0, 0, 0],
      showDeleteRowModal: false,
      deleteId: Infinity,
      delRowTaskProject: {
        projectName: "",
        taskName: "",
      },
    };
  }

  /*
    * Button handlers
  */
  private handleCloseDelModal = () => {
    this.setState({ showDeleteRowModal: false });
  };
  /**
   * Takes the taskId from the row, which is the key in the stateRowData Map, and setState from delRowTaskProject
   * @param rowId 
   */
  private handleShowDelModal = (rowId: number | undefined) => {
    const { stateRowData } = this.state
    if (rowId) {
      const taskRowData: TaskRowData | undefined = stateRowData.get(rowId);
      this.setState({ delRowTaskProject: { projectName: taskRowData?.projectName, taskName: taskRowData?.taskName } })
    }
    this.setState({ deleteId: rowId });
    this.setState({ showDeleteRowModal: true });
  };
  /**
   * Deletes the row depended on the the rowId, set in handleShowDelModal()
   */
  private handleDeleteRow = () => {
    const { stateRowData, deleteId } = this.state;
    if (deleteId) {
      stateRowData.delete(deleteId);
    }
    this.setState({ stateRowData });
    this.handleCloseDelModal();
  }
  private handleCloseAddModal = () => {
    this.setState({ showAddRowModal: false })
  }
  private handleShowAddModal = () => {
    this.setState({ showAddRowModal: true })
  }
  /**
   * Adds a project withput any time data
   */
  private handleAddRow = () => {
    const { stateRowData, selectedProject } = this.state

    stateRowData.set(selectedProject.taskId, { projectName: selectedProject.projectName, taskName: selectedProject.taskName, taskId: selectedProject.taskId, objectData: [] })

    this.handleCloseAddModal();
  }

  /**
   * Changes the time value for a specific task row data at a given date index in the TimeSheet.
   * @param index - The index of the date for which the time value needs to be changed.
   * @param value - The new time value to be set.
   * @param data - The task row data object to which the time value belongs.
   */
  private handleTimeChange(index: number, value: string, data: TaskRowData | undefined) {
    const { stateRowData, offsetState } = this.state;

    // Changes the value to a number and checks if number is under 0
    let newValue: number = parseInt(value);
    if (isNaN(newValue)) {
      newValue = 0
    }

    // gets dates for a week
    let dates: string[] = [];
    getCurrentWeekDates(dates, offsetState);

    // Loop through each task in stateRowData data
    for (const key of Array.from(stateRowData.keys())) {
      let rowData = stateRowData.get(key);
      if (data && rowData && data.taskId === rowData.taskId) {
        // Loop through each objectData of the current row
        let dateFound: boolean = false;
        rowData.objectData.map((item) => {
          let minutes = item.time % 60
          // If the date of the item matches the selected date
          if (item.date === Date.parse(dates[index])) {
            // If the new value + the minutes is zero, remove the item from the array
            if (newValue + minutes === 0 && rowData) {
              rowData.objectData = rowData.objectData.filter(
                (objItem) => objItem.date !== item.date
              );
            } else {
              // Update the time of the item with the new value
              if (newValue < item.time / 60) {
                item.time = newValue * 60 + (minutes);
              } else {
                item.time = newValue * 60 + (minutes);
              }
            }
            dateFound = true;
          }
          return item; // just to return something
        });

        // If the date was not found and the new value is greater than zero, push a new objectData to the row
        if (!dateFound && newValue > 0) {
          rowData.objectData.push({ date: Date.parse(dates[index]), time: Math.max(0, newValue * 60), approved: false, managerLogged: false });
        }

        this.setState({ stateRowData });
        break; // Break out of the map function if date matches or if a new object was pushed.
      }
    }
  }

  /**
     * This function handles the change event for a time select input. It takes in three parameters:
     * @param index - the index of the selected option
     * @param value - the value of the selected option
     * @param data - an object that represents the row data for a task
   */
  private handleTimeSelectChange(index: number, value: string, data: TaskRowData | undefined) {
    const { stateRowData, offsetState } = this.state;

    let newValue = parseInt(value);

    // gets dates for a week
    let dates: string[] = [];
    getCurrentWeekDates(dates, offsetState);

    // Loop through each task in stateRowData data
    for (const key of Array.from(stateRowData.keys())) {
      let rowData = stateRowData.get(key);
      if (data && rowData && data.taskId === rowData.taskId) {
        // Loop through each objectData of the current row
        let dateFound: boolean = false;
        rowData.objectData.map((item) => {
          let hoursInMinutes = Math.floor(item.time / 60) * 60
          // If the date of the item matches the selected date
          if (item.date === Date.parse(dates[index])) {
            // If the new value + the minutes is zero, remove the item from the array
            if (newValue + hoursInMinutes === 0 && rowData) {
              rowData.objectData = rowData.objectData.filter(
                (objItem) => objItem.date !== item.date
              );
            } else {
              // Update the time of the item with the new value
              item.time = newValue + hoursInMinutes;
            }
            dateFound = true;
          }
          return item; // just to return something
        });

        // If the date was not found and the new value is greater than zero, push a new objectData to the row
        if (!dateFound && newValue > 0) {
          rowData.objectData.push({ date: Date.parse(dates[index]), time: Math.max(0, newValue), approved: false, managerLogged: false });
        }

        this.setState({ stateRowData });
        break; // Break out of the map function if date matches or if a new object was pushed.
      }
    }
  }

  /**
   * This function handles the submit button click event. It updates, creates, and deletes time sheet data.
   */
  private handleSubmitButton() { // The put and post request should console.log more usefull information
    const { stateRowData, prevRowSubmitData } = this.state
    const { userId } = this.props
    // Create an array of time sheet data objects to update
    let dataToUpdate: TimeSheetData[] = [];
    for (const key of Array.from(stateRowData.keys())) {
      let data = stateRowData.get(key);
      if (data) {
        data.objectData.map((item) => {
          let dataToUpdate2: TimeSheetData = {
            date: item.date,
            taskId: data?.taskId ?? Infinity,
            time: item.time,
            taskName: data?.taskName ?? "",
            projectName: data?.projectName ?? "",
            approved: item.approved,
            managerLogged: item.managerLogged
          }
          dataToUpdate.push(dataToUpdate2);
          return true
        });
      }
    }
    // Loop through the data to update, send PUT requests for existing data, and POST requests for new data
    dataToUpdate.map((item) => {
      let foundItem = false;
      delete item.projectName;
      item.userId = userId;
      // Check if the data already exists
      for (let i = 0; i < prevRowSubmitData.length; i++) {
        if (item.taskId === prevRowSubmitData[i].taskId &&
          item.date === prevRowSubmitData[i].date &&
          item.time === prevRowSubmitData[i].time) {
          console.log("Previos data:");
          foundItem = true;
        } else if (item.taskId === prevRowSubmitData[i].taskId &&
          item.date === prevRowSubmitData[i].date) { // Should put data
          console.log("Update data:");
          item.managerLogged = false
          console.log(item)
          let apiHandler = new BaseApiHandler();
          apiHandler.put(`/api/time/register/edit/put`, { body: item }, (value) => {
            console.log(value);
          })
          foundItem = true;
        }
      }

      // If the data does not exist, create it with a POST request
      if (!foundItem) {
        delete item.taskName
        item.managerLogged = false
        console.log("New data:");
        let apiHandler = new BaseApiHandler();
        apiHandler.post(`/api/time/register/post`, { body: item }, (value) => {
          console.log(value);
        })
      }
      return true;
    });
    // Find deleted items and update them with PUT requests
    let deletedItem = prevRowSubmitData.filter(delItem =>
      !dataToUpdate.some(delItem2 =>
        delItem2.taskId === delItem.taskId && delItem2.date === delItem.date
      )
    );
    for (let k = 0; k < deletedItem.length; k++) { // should be able to delete, but for now updates time
      deletedItem[k].time = 60 // Should be 0
      deletedItem[k].userId = userId
      deletedItem[k].managerLogged = false
      console.log("Deleted data:")
      let apiHandler = new BaseApiHandler();
      apiHandler.put(`/api/time/register/edit/put`, { body: deletedItem[k] }, (value) => {
        console.log(value);
      })
    }
    // Set the deleted items in state and log the previous row submit data
    this.setState({ deletedItems: deletedItem })
    console.log(prevRowSubmitData)
  }

  /**
   * Handles button click event and updates offset state, header dates, and fetches new data.
   * @param increment The increment by which to update the offset state.
   */
  private handleButtonClick = async (increment: number) => {
    const { offsetState } = this.state;
    const updatedOffset = offsetState + increment;
    this.setState({ offsetState: updatedOffset });
    const newDates: string[] = [];
    await getCurrentWeekDates(newDates, updatedOffset);
    this.setState({ headerDates: newDates });
    await this.getData(updatedOffset);
  }

  /**
   * Displays the total time in hours and minutes.
   * @param value The total time in minutes.
   * @returns A JSX element containing the total time in hours and minutes.
   */
  private displayTimeTotal = (value: number): JSX.Element => {

    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    return (
      <p>{hours}:{minutes}</p>
    )
  }


  /**
   * Retrieves data from an API endpoint and sets the state of the component.
   * @param timeOffset Optional time offset to retrieve data for a specific week.
   */
  private getData(timeOffset: number = 0) {
    const { userId } = this.props;

    // Gets the dates for the week
    let timeSheetDate: string[] = []
    getCurrentWeekDates(timeSheetDate, timeOffset);

    // Make the API call to retrieve the user's task data for the current week.
    let apiHandler = new BaseApiHandler();
    apiHandler.get(
      `/api/time/register/get?user=${userId}&period=${Date.parse(timeSheetDate[0])},${Date.parse(timeSheetDate[6])}&var=taskName,taskId,time,date,approved,managerLogged,userId`, {},
      (value) => {
        // Parse the API response into JSON format.
        let json: Api = JSON.parse(JSON.stringify(value));
        // Create a new Map object to hold the user's task data.
        let taskData: Map<number, TaskRowData> = new Map<number, TaskRowData>();
        // If the API call was successful (status code 200), process the data.
        if (json.status === 200) {
          for (const task of json.data) {
            if (taskData.has(task.taskId)) {
              // If the task data is already in the Map, update the objectData array.
              let data = taskData.get(task.taskId);
              if (data) {
                data?.objectData.push({ date: task.date, time: task.time, approved: task.approved, managerLogged: task.managerLogged });
                taskData.set(task.taskId, data);
              }
            } else {
              // If the task data is not in the Map, add it with a new objectData array.
              taskData.set(task.taskId, { projectName: task.projectName ?? "", taskName: task.taskName ?? "", taskId: task.taskId, objectData: [{ date: task.date, time: task.time, approved: task.approved, managerLogged: task.managerLogged }] })
            }
          }
          this.setState({ stateRowData: taskData })
        }
        this.setState({ prevRowSubmitData: json.data })
      }
    );
  }

  /**
   * Executes when the component mounts.
   */
  public componentDidMount() {
    const { offsetState } = this.state

    // Get current weeks
    const dates: string[] = [];
    getCurrentWeekDates(dates, offsetState);
    this.setState({ headerDates: dates })

    // Retrieves data and sets it in the state
    this.getData(offsetState);

    // Retrieves user tasks and projects data and sets it in the state
    const { userId } = this.props;
    let apiHandler = new BaseApiHandler();
    apiHandler.get(
      `/api/user/task/project/get?user=${userId}&var=taskId,taskName,projectId,projectName`, {},
      (value) => {
        let json: AddModalApi = JSON.parse(JSON.stringify(value));
        if (json.status === 200) {
          this.setState({ searchDataState: json.data })
        }
      }
    );
  }

  /**
   * Get the time data for a specific task from the state row data
   * @param id The ID of the task to get the time data for
   * @param timeArr An array to store the time data for each day of the week
   * @returns An array of time data for each day of the week
   */
  private getTimeFromData(id: number, timeArr: NumberWithBoolean[]): NumberWithBoolean[] {
    const { stateRowData, offsetState } = this.state;

    // Initialize the time array with 0s for each day of the week
    for (let j = 0; j < 7; j++) {
      timeArr.push([0, false]);
    }

    // Get the current week's dates
    let dates: string[] = [];
    getCurrentWeekDates(dates, offsetState);

    // Loop through each task in the state row data
    for (const key of Array.from(stateRowData.keys())) {
      let data = stateRowData.get(key);
      if (data && id === data.taskId) {
        // If the task ID matches, loop through each object data item
        data.objectData.map((item) => {
          // Loop through each date in the current week
          for (let i = 0; i < dates.length; i++) {
            const currentDate = dateStringFormatter(item.date);
            const matchDate = dates[i];
            if (currentDate === matchDate) {
              // If the date matches, set the time for that day in the time array
              timeArr[i][0] = item.time;
              timeArr[i][1] = item.approved
            }
          }
          return true;
        })
      }
    }
    console.log()
    return timeArr;
  }

  /**
   * This function renders the header row of the table.
   * @returns The header row JSX.Element
   */
  renderHeaderRow() {
    const { headerDates } = this.state

    let i: number = 0;

    // The days of the week
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Get the current date and format it to a string
    const today = new Date();
    const stringToday = dateStringFormatter(dateToNumber(today));
    return (
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Task Name</th>
          {/* Loop over the dates and render each one in a table header cell */}
          {headerDates.map((date, index) => {
            const weekday = weekdays[i];
            i = i + 1;
            // Add a "bg-light" class to the header cell if it corresponds to today's date
            return (<th key={index} style={{ textAlign: "center", verticalAlign: "buttom" }} className={date === stringToday ? "bg-light" : ""}>
              <div style={{ lineHeight: "1em" }}>{weekday}</div>
              <div style={{ lineHeight: "1em" }}>{date}</div>
            </th>)
          })}
          <th>Total Time</th>
          <th style={{ textAlign: "center" }}>&#128465;</th>{/* Trashcan, HTML Entity: */}
        </tr>
      </thead>
    )
  }

  /**
   * Renders the table rows for each task based on the current state.
   * @returns Returns an array of JSX elements representing the rows.
   */
  renderTaskRows() {
    const { stateRowData, searchDataState } = this.state;

    // Initialize an array for storing the task time data for each day
    let rows: JSX.Element[] = [];

    // Loop through each task in stateRowData and check if it matches any task in searchDataState
    for (const key of Array.from(stateRowData.keys())) {
      let data = stateRowData.get(key);
      if (data) {
        let arr: NumberWithBoolean[] = [];
        for (let i = 0; i < searchDataState.length; i++) {
          // If there is a match, get the task name and project name, mark the task as rendered,
          // and get the task time data for each day
          if (data.taskId === searchDataState[i].taskId) {
            let taskProjectName: string = searchDataState[i].projectName
            searchDataState[i].isRendered = true
            this.getTimeFromData(data.taskId, arr)
            // Create a JSX element for the row and add it to the rows array
            rows.push((
              <tr key={data.taskId} >
                <td>{taskProjectName}</td>
                <td>{data.taskName}</td>
                {arr.map((num, index) => {
                  return (
                    <td key={index} style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <InputGroup size="sm">
                        <Form.Control disabled={arr[index][1]} type="number" placeholder="0" value={Math.floor(arr[index][0] / 60)} onChange={(e) => this.handleTimeChange(index, e.target.value, data)} />
                        <InputGroup.Text id={`basic-addon-${index}`}>:</InputGroup.Text>
                        <Form.Select
                          style={{ fontSize: '14px', border: '1px solid #ccc', borderRadius: '0 4px 4px 0', fontFamily: 'Helvetica', color: "#212529", backgroundColor: arr[index][1] ? '#e9ecef' : '#fff' }}
                          className="myFormSelect"
                          bsPrefix="myFormSelect"
                          defaultValue={arr[index][0] % 60}
                          disabled={arr[index][1]}
                          onChange={(e) => this.handleTimeSelectChange(index, e.target.value, data)}>
                          <option value={0}>0</option>
                          <option value={15}>15</option>
                          <option value={30}>30</option>
                          <option value={45}>45</option>
                        </Form.Select>
                      </InputGroup>
                    </td>
                  );
                })}
                <td>{this.displayTimeTotal(arr.reduce((partialSum, [num]) => { return partialSum + num }, 0))}</td>
                <td><Button variant="danger" onClick={() => this.handleShowDelModal(data?.taskId)}>-</Button></td>
              </tr>
            ))
          } else { searchDataState[i].isRendered = false } // If there is no match, mark the task as not rendered
        }
      }
    }
    return rows;
  }

  renderButton() {
    const { adminPicked } = this.props

    if (!adminPicked) {
      return (
        <div>
          <Button variant="primary" type="button" onClick={() => this.handleShowAddModal()}>Add Row</Button>
          <Button variant="primary" type="button" style={{ float: "right" }} onClick={() => this.handleSubmitButton()} >Submit</Button>
        </div>
      );
    }
  }

  render() {
    const { showAddRowModal, showDeleteRowModal, deleteId, delRowTaskProject, searchDataState, deletedItems } = this.state;

    return (
      <Container fluid="lg">
        <Table bordered size="sm" className="fixed-table ellipses">
          {this.renderHeaderRow()}
          <tbody>{this.renderTaskRows()}</tbody>
        </Table>
        {this.renderButton()}
        <center>
          <ButtonGroup aria-label="Basic example">
            <Button onClick={() => this.handleButtonClick(-7)} variant="primary">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Button onClick={() => this.handleButtonClick(7)} variant="primary">
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </ButtonGroup>
        </center>
        {this.props.adminPicked === true ? null : <p>Delete task at date:</p>}
        {deletedItems.map((item, index) => {
          return <p key={index}>{item.taskName}, at {dateStringFormatter(item.date)}</p>
        })}
        <></>
        <Modal show={showAddRowModal} onHide={this.handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Row?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Which task do you want to add?</p>
            <Form.Group className="mb-3" controlId="formBasicAssignManager">
              <Typeahead
                id="findProject"
                labelKey={(option: any) => `${option.projectName}  ${option.taskName}`}
                options={searchDataState.filter((option: any) => option.isRendered === false)}
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
        <></>
        <Modal show={showDeleteRowModal} onHide={this.handleCloseDelModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Row?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete, task Id: {deleteId}</p>
            <p>{delRowTaskProject.projectName} and {delRowTaskProject.taskName}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseDelModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={this.handleDeleteRow}> {/* This 2 is the row number (taskId) */}
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container >
    );
  }
}

export default TimeSheetPage;