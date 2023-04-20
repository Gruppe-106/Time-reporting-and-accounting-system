import React, { Component } from 'react';
import { Container, Table, Form, InputGroup, Button, ButtonGroup, Modal } from "react-bootstrap";
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead';
import BaseApiHandler from "../../../network/baseApiHandler";
import { getCurrentWeekDates, dateStringFormatter, dateToNumber } from "../../../utility/timeConverter"
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Api {
  status: number,
  data: TimeSheetData[]
}

interface AddModalApi {
  status: number,
  data: SearchData[]
}

// Loaded data from database, used in TimeSheetRow and TimeSheetPage
interface TimeSheetData {
  projectName?: string;
  userId?: number,
  taskName?: string;
  taskId: number;
  time: number;
  date: number;
}

interface SearchData {
  taskId: number,
  taskName: string,
  projectId: number,
  projectName: string,
  isRendered?: boolean
}

interface TaskRowData {
  projectName: string;
  taskName: string;
  taskId: number;
  objectData: {
    time: number;
    date: number;
  }[]
}

/*

    * TODO: User timeSheet
      * Only render table row if there is time for said table, otherwise be able to create a row for that task.
      * (Need api for project name and task name connected to user).
      * 
      * 
      * Submit button (Post data)

*/

// Props used in TimeSheetPage
interface TimeSheetProp {
  userId: number;
}

// Variable states in TimeSheetPage
interface TimeSheetState {
  stateRowData: Map<number, TaskRowData>;
  prevRowSubmitData: TimeSheetData[];
  searchDataState: SearchData[]
  selectedProject: SearchData
  offsetState: number;
  isUpdating: boolean;
  showAddModal: boolean;
  headerDates: string[];
  times: number[];
  showDeleteRowModal: boolean;
  deleteId: number | undefined,
  delRowTaskProject: {
    projectName: string | undefined,
    taskName: string | undefined,
  },
}

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
      selectedProject: {
        taskId: Infinity,
        taskName: "",
        projectId: Infinity,
        projectName: "",
      },
      offsetState: -28,
      isUpdating: false,
      showAddModal: false,
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

  private handleCloseDelModal = () => {
    this.setState({ showDeleteRowModal: false });
  };
  private handleShowDelModal = (rowId: number | undefined) => {
    const { stateRowData } = this.state
    if (rowId) {
      const taskRowData: TaskRowData | undefined = stateRowData.get(rowId);
      this.setState({ delRowTaskProject: { projectName: taskRowData?.projectName, taskName: taskRowData?.taskName } })
    }
    this.setState({ deleteId: rowId });
    this.setState({ showDeleteRowModal: true });
  };
  private handleDeleteRow = () => {
    const { stateRowData, deleteId } = this.state;
    if (deleteId) {
      stateRowData.delete(deleteId);
    }
    this.setState({ stateRowData });
    this.handleCloseDelModal();
  }
  // ************************************************
  private handleCloseAddModal = () => {
    this.setState({ showAddModal: false })
  }
  private handleShowAddModal = () => {
    this.setState({ showAddModal: true })
  }
  private handleAddRow = () => {
    const { stateRowData, selectedProject } = this.state

    stateRowData.set(selectedProject.taskId, { projectName: selectedProject.projectName, taskName: selectedProject.taskName, taskId: selectedProject.taskId, objectData: [] })

    this.handleCloseAddModal();
  }

  private handleTimeChange(index: number, value: string, data: TaskRowData | undefined) {
    const { stateRowData, offsetState } = this.state;

    let newValue: number = parseInt(value);
    if (isNaN(newValue)) {
      newValue = 0
    }

    let dates: string[] = [];
    getCurrentWeekDates(dates, offsetState);

    for (const key of Array.from(stateRowData.keys())) {
      let rowData = stateRowData.get(key);
      if (data && rowData && data.taskId === rowData.taskId) {
        let dateFound: boolean = false;
        rowData.objectData.map((item) => {
          let minutes = item.time % 60
          if (item.date === Date.parse(dates[index])) {
            if (newValue + minutes === 0 && rowData) {
              rowData.objectData = rowData.objectData.filter(
                (objItem) => objItem.date !== item.date
              );
            } else {
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

        if (!dateFound && newValue > 0) {
          rowData.objectData.push({ date: Date.parse(dates[index]), time: Math.max(0, newValue * 60) });
        }

        this.setState({ stateRowData });
        break; // Break out of the map function if date matches or if a new object was pushed.
      }
    }
  }

  private handleTimeSelectChange(index: number, value: string, data: TaskRowData | undefined) {
    const { stateRowData, offsetState } = this.state;

    let newValue = parseInt(value);

    let dates: string[] = [];
    getCurrentWeekDates(dates, offsetState);

    for (const key of Array.from(stateRowData.keys())) {
      let rowData = stateRowData.get(key);
      if (data && rowData && data.taskId === rowData.taskId) {
        let dateFound: boolean = false;
        rowData.objectData.map((item) => {
          let hoursInMinutes = Math.floor(item.time / 60) * 60
          if (item.date === Date.parse(dates[index])) {
            if (newValue + hoursInMinutes === 0 && rowData) {
              rowData.objectData = rowData.objectData.filter(
                (objItem) => objItem.date !== item.date
              );
            } else {
              item.time = newValue + hoursInMinutes;
            }
            dateFound = true;
          }
          return item; // just to return something
        });

        if (!dateFound && newValue > 0) {
          rowData.objectData.push({ date: Date.parse(dates[index]), time: Math.max(0, newValue) });
        }

        this.setState({ stateRowData });
        break; // Break out of the map function if date matches or if a new object was pushed.
      }
    }
  }

  private handleSubmitButton() {
    const { stateRowData, prevRowSubmitData } = this.state
    const { userId } = this.props
    // TimeSheetData
    //Convert every objectData array in stateRowData to an TimeSheetData item in an array: someVariable TimeSheetData[]
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
          }
          dataToUpdate.push(dataToUpdate2);
          return true
        });
      }
    }
    console.log("Breakpoint ---------------")
    // check if previous data is the same
    // if it is then do nothing (Console.log("no data changed"))
    dataToUpdate.map((item) => {
      delete item.projectName;
      item.userId = userId;
      let foundItem = false;
      for (let i = 0; i < prevRowSubmitData.length; i++) {
        if (item.taskId === prevRowSubmitData[i].taskId &&
          item.date === prevRowSubmitData[i].date &&
          item.time === prevRowSubmitData[i].time) {
          console.log("Previos data:");
          foundItem = true;
        } else if (item.taskId === prevRowSubmitData[i].taskId &&
          item.date === prevRowSubmitData[i].date) { // Should put data
          console.log("Update data:");
          let apiHandler = new BaseApiHandler();
          apiHandler.put(`/api/time/register/edit/put`, { body: item }, (value) => {
            console.log(value);
          })
          foundItem = true;
        }
      }
      if (!foundItem) {  // else create and post the new data
        delete item.taskName
        console.log("New data:");
        let apiHandler = new BaseApiHandler();
        apiHandler.post(`/api/time/register/post`, { body: item }, (value) => {
          console.log(value);
        })

      }
      return true;
    });
    if (dataToUpdate.length < prevRowSubmitData.length) {
      const deletedItems = prevRowSubmitData.filter((item) => !dataToUpdate.some((d) => d.taskId === item.taskId && d.date === item.date && d.time === item.time));
      console.log("data to delete:", deletedItems);
    }
    // Needs to find deleted items better
  }

  private handleButtonClick = async (increment: number) => {
    const { offsetState } = this.state;
    const updatedOffset = offsetState + increment;
    this.setState({ offsetState: updatedOffset });
    const newDates: string[] = [];
    await getCurrentWeekDates(newDates, updatedOffset);
    this.setState({ headerDates: newDates });
    await this.getData(updatedOffset);
  }

  private displayTimeTotal = (value: number): JSX.Element => {

    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    return (
      <p>{hours}:{minutes}</p>
    )
  }



  /*
  
  ******* Get data function
  
  */
  private getData(timeOffset: number = 0) {
    const { userId } = this.props;
    let timeSheetDate: string[] = []
    getCurrentWeekDates(timeSheetDate, timeOffset);
    let apiHandler = new BaseApiHandler();
    apiHandler.get(
      `/api/time/register/get?user=${userId}&period=${Date.parse(timeSheetDate[0])},${Date.parse(timeSheetDate[6])}&var=taskName,taskId,time,date`, {},
      (value) => {
        let json: Api = JSON.parse(JSON.stringify(value));
        let taskData: Map<number, TaskRowData> = new Map<number, TaskRowData>();
        if (json.status === 200) {
          for (const task of json.data) {
            if (taskData.has(task.taskId)) {
              let data = taskData.get(task.taskId);
              if (data) {
                data?.objectData.push({ date: task.date, time: task.time });
                taskData.set(task.taskId, data);
              }
            } else {
              taskData.set(task.taskId, { projectName: task.projectName ?? "", taskName: task.taskName ?? "", taskId: task.taskId, objectData: [{ date: task.date, time: task.time }] })
            }
          }
          this.setState({ stateRowData: taskData })
        }
        this.setState({ prevRowSubmitData: json.data })
      }
    );
  }

  // Called once when code is runned
  public componentDidMount() {
    const { offsetState } = this.state
    const dates: string[] = [];
    getCurrentWeekDates(dates, offsetState);
    this.setState({ headerDates: dates })
    this.getData(offsetState);

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

  private getTimeFromData(id: number, timeArr: number[]): number[] {
    const { stateRowData, offsetState } = this.state;

    for (let j = 0; j < 7; j++) {
      timeArr[j] = 0;
    }

    let dates: string[] = [];
    getCurrentWeekDates(dates, offsetState);

    for (const key of Array.from(stateRowData.keys())) {
      let data = stateRowData.get(key);
      if (data && id === data.taskId) {
        data.objectData.map((item) => {
          for (let i = 0; i < dates.length; i++) {
            const currentDate = dateStringFormatter(item.date);
            const matchDate = dates[i];
            if (currentDate === matchDate) {
              timeArr[i] = item.time;
            }
          }
          return true;
        })
      }
    }
    console.log()
    return timeArr;
  }

  renderHeaderRow() {
    const { headerDates } = this.state

    let i: number = 0;

    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const today = new Date();
    const stringToday = dateStringFormatter(dateToNumber(today));
    return (
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Task Name</th>
          {headerDates.map((date, index) => {
            const weekday = weekdays[i];
            i = i + 1;
            return (<th key={index} style={{ textAlign: "center", verticalAlign: "buttom" }} className={date === stringToday ? "bg-light" : ""}><div style={{ lineHeight: "1em" }}>{weekday}</div><div style={{ lineHeight: "1em" }}>{date}</div></th>)
          })}
          <th>Total Time</th>
          <th style={{ textAlign: "center" }}>&#128465;</th>{/* Trashcan, HTML Entity: */}
        </tr>
      </thead>
    )
  }

  renderTaskRows() {
    const { stateRowData, searchDataState } = this.state;

    let arr: number[] = [];
    let rows: JSX.Element[] = [];

    for (const key of Array.from(stateRowData.keys())) {
      let data = stateRowData.get(key);
      if (data) {
        for (let i = 0; i < searchDataState.length; i++) {
          if (data.taskId === searchDataState[i].taskId) {
            let taskProjectName: string = searchDataState[i].projectName
            searchDataState[i].isRendered = true
            this.getTimeFromData(data.taskId, arr)
            rows.push((
              <tr key={data.taskId} >
                <td>{taskProjectName}</td>
                <td>{data.taskName}</td>
                {arr.map((num, index) => {
                  return (
                    <td key={index} style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <InputGroup size="sm">
                        <Form.Control type="number" placeholder="0" value={Math.floor(arr[index] / 60)} onChange={(e) => this.handleTimeChange(index, e.target.value, data)} />
                        <InputGroup.Text id={`basic-addon-${index}`}>:</InputGroup.Text>
                        <Form.Select
                          style={{ fontSize: '14px', border: '1px solid #ccc', borderRadius: '0 4px 4px 0', fontFamily: 'Helvetica', color: "#212529" }}
                          className="myFormSelect"
                          bsPrefix="myFormSelect"
                          defaultValue={arr[index] % 60}
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
                <td>{this.displayTimeTotal(arr.reduce((partialSum, a) => partialSum + a, 0))}</td>
                <td><Button variant="danger" onClick={() => this.handleShowDelModal(data?.taskId)}>-</Button></td>
              </tr>
            ))
          } else { searchDataState[i].isRendered = false }
        }
      }
    }
    return rows;
  }

  render() {
    const { showAddModal, showDeleteRowModal, deleteId, delRowTaskProject, searchDataState } = this.state;

    return (
      <Container fluid="lg">
        <Table bordered size="sm" className="fixed-table ellipses">
          {this.renderHeaderRow()}
          <tbody>{this.renderTaskRows()}</tbody>
        </Table>
        <Button variant="primary" type="button" onClick={() => this.handleShowAddModal()}>Add Row</Button>
        <Button variant="primary" type="button" style={{ float: "right" }} onClick={() => this.handleSubmitButton()} >Submit</Button>
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
        <></>
        <Modal show={showAddModal} onHide={this.handleCloseAddModal}>
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