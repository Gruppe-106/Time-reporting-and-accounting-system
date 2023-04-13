import React, { Component } from 'react';
import { Container, Table, Form, InputGroup, Button, Modal } from "react-bootstrap";
//import { Highlighter, Typeahead } from 'react-bootstrap-typeahead';
import BaseApiHandler from "../../../network/baseApiHandler";
import { getCurrentWeekDates, dateStringFormatter, dateToNumber } from "../../../utility/timeConverter"

interface Api {
  status: number,
  data: TimeSheetRowData[]
}

/*

    * TODO: User timeSheet
      * Only render table row if there is time for said table, otherwise be able to create a row for that task.
      * (Need api for project name and task name connected to user).
      * 
      * 
      * Submit button (Post data)

*/

// Empty prop to indicate that the component will not recive a prop.
interface EmptyProps { }

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
      headerDates: getCurrentWeekDates(dates, -21),
    };
  }

  render() {
    const today = new Date();
    const stringToday = dateStringFormatter(dateToNumber(today));


    return (
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Task Name</th>
          {/* Gets the dates, and maps each date with an index to a table header, creating 7 <th>, all dates in a week */}
          {this.state.headerDates.map((date, index) => (
            <th key={index} className={date === stringToday ? "bg-light" : ""}>{date}</th>
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
  projectName: string;
  taskName: string;
  taskId: number;
  time: number;
  date: number;
}

// The props given to TimeSheetRow
interface TimeSheetRowProps {
  rowData: Map<number, TaskRowData>;
  onDelete: (rowId: number) => void;
}

// State of variables in TimeSheetRow
interface TimeSheetRowState {
  times: number[];
  showDeleteRowModal: boolean;
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

    * Creating a tablerow for the table body, takes in 2 props, data and onDelete

*/
class TimeSheetRow extends Component<TimeSheetRowProps, TimeSheetRowState> {
  constructor(props: TimeSheetRowProps) {
    super(props);

    // Inilisie all states
    this.state = {
      times: [0, 0, 0, 0, 0, 0, 0],
      showDeleteRowModal: false,
    };
  }

  /*
      * Closes the modal 
   */
  private handleCloseModal = () => {
    this.setState({ showDeleteRowModal: false });
  };

  /*
      * Opens the modal
   */
  private handleShowDelModal = () => {
    this.setState({ showDeleteRowModal: true });
  };


  /*
      * Calles the onDelete function/method, and then closes the modal 
   */
  private handleDeleteClick = (rowId: number) => {
    const { onDelete } = this.props;
    onDelete(rowId);
    this.handleCloseModal();
  };

  getTimeData(id: number, timeArr: number[]): number[] {
    const { rowData } = this.props;

    for (let j = 0; j < 7; j++) {
      timeArr[j] = 0;
    }

    let dates: string[] = [];
    getCurrentWeekDates(dates, -21);

    for (const key of Array.from(rowData.keys())) {
      let data = rowData.get(key);
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
    return timeArr;
  }


  renderTaskRows() {
    const { rowData } = this.props;

    let arr: number[] = [];

    let rows: JSX.Element[] = [];

    for (const key of Array.from(rowData.keys())) {
      let data = rowData.get(key);
      if (data) {
        this.getTimeData(data.taskId, arr)
        rows.push((
          <tr>
            <td>{data.projectName}</td>
            <td>{data.taskName}</td>
            {arr.map((num, index) => {
              return (
                <td key={index}>
                  <InputGroup size="sm">
                    <Form.Control type="number" placeholder="0" value={num} />
                    <InputGroup.Text id={`basic-addon-${index}`}>:</InputGroup.Text>
                    <Form.Select>
                      <option value="0">0</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </Form.Select>
                  </InputGroup>
                </td>
              );
            })}
            <td>{arr.reduce((partialSum, a) => partialSum + a, 0)}</td>
            <td><Button variant="danger" size="sm" onClick={() => this.handleShowDelModal()}>-</Button></td>
          </tr>
        ))
      }
    }
    return rows;
  }
  //<td>{data.taskId}</td>
  //<Button variant="danger" size="sm" onClick={() => this.handleShowDelModal(data.taskId)}>Delete</Button>



  render() {
    const { showDeleteRowModal } = this.state;

    return (
      <Container>
        <Table bordered size="sm" className="fixed-table ellipses">
          <TableHeader />
          <tbody>{this.renderTaskRows()}</tbody>
        </Table>
        <></>
        <Modal show={showDeleteRowModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Row?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete:</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => this.handleDeleteClick(2)}> {/* This 2 is the row number (taskId) */}
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

// Props used in TimeSheetPage
interface TimeSheetProp {
  userId: number;
}

// Variable states in TimeSheetPage
interface TimeSheetState {
  stateRowData: Map<number, TaskRowData>;
  showAddModal: boolean;
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
      showAddModal: false,
    };
  }

  // apiHandler to get data from "database", the data is passed to the data array
  public componentDidMount() {
    const { userId } = this.props;
    let apiHandler = new BaseApiHandler();
    apiHandler.get(
      `/api/time/register/get?user=${userId}&period=${0},${Date.now()}&var=taskName,taskId,projectName,time,date`, {},
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
              taskData.set(task.taskId, { projectName: task.projectName, taskName: task.taskName, taskId: task.taskId, objectData: [{ date: task.date, time: task.time }] })
            }
          }
          this.setState({ stateRowData: taskData })
        }
      }
    );
  }

  handleShowAddModal = () => {
    this.setState({ showAddModal: true })
  }
  handleCloseModal = () => {
    this.setState({ showAddModal: false })
  }
  handleAddModal = () => {
    const { stateRowData } = this.state

    stateRowData.set(-1, { projectName: "NewName", taskName: "NewName", taskId: -1, objectData: [{ date: 1679616000, time: 10 }] })

    this.handleCloseModal();
  }
  handleDeleteRow = (rowId: number) => {
    const { stateRowData } = this.state;
    stateRowData.delete(rowId); // Delete the row from rowData map based on rowId
    this.setState({ stateRowData }); // Update the state to trigger re-render
  }

  render() {
    const { stateRowData, showAddModal } = this.state;

    return (
      <Container fluid="lg">
        <TimeSheetRow rowData={stateRowData} onDelete={this.handleDeleteRow} />
        <Button variant="primary" type="button" onClick={() => this.handleShowAddModal()}>Add Row</Button>
        <></>
        <Modal show={showAddModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Row?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>Cancel</Button>
            <Button variant="primary" onClick={this.handleAddModal}>Add</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default TimeSheetPage;