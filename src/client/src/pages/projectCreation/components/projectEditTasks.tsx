import React, {Component} from "react";
import {Alert, Button, Col, Container, Form, InputGroup, Row, Tab, Table} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
import Nav from "react-bootstrap/Nav";
import {userInfo} from "../../../utility/router";
import Modal from "react-bootstrap/Modal";
import {Highlighter, Typeahead} from "react-bootstrap-typeahead";

interface TableRow {
  taskName: string;
  startDate: string;
  endDate: string;
  timeType: string;
  userId: string[];
}

interface DynamicTableState {
  rows: TableRow[];
  formData: TableRow;
  task: TaskProjectApi;
  member: MemberApi;
  users: UserApi;
  timeTypes: TimeApi;
  formSubmitted?: boolean;
  showDelete?: boolean
  showAdd?: boolean
  invalidStartDate: boolean,
  invalidEndDate: boolean,
  assignedToUser?: { id: number, name: string},
  buttonDisabled?: boolean
}

interface DynamicTableProps {
  initialRows: TableRow[];
  onRowsUpdate?: (rows: TableRow[]) => void;
}

interface Api{
  status:number,
  data:{
    id?: number,
    name?: string,
    startDate?: number,
    endDate?: number,
    timeType?: number
  }[]
}
interface MemberApi{

  status: number,
  data: {
    userId?: number
  }[]
}

interface UserApi{
  status: number,
  data: {
    id?: number,
    email?: string,
    firstName?: string,
    lastName?: string,
    group?: number
  }[]
}

interface TimeApi{
  status: number,
  data: {
    id?: number,
    name?: string
  }[]
}

interface TaskProjectApi{
  status: number;
  data: {
    taskId?: number,
    taskName?: string,
    projectId?: number,
    projectName?: string,
    id?: number,
    name?: string,
    startDate?: number,
    endDate?: number,
    timeType?: number
  }[]
}

//Gets search query id to be used to get relevant information
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id") as string);

class CreateTaskTable extends Component<DynamicTableProps, DynamicTableState, TaskProjectApi>{

  constructor(props: DynamicTableProps) {
    super(props);
    this.state = {
      rows: props.initialRows,
      formData: {
        taskName: "",
        startDate: "",
        endDate: "",
        timeType: "1",
        userId: [""]
      },
      task: {
        status: -1,
        data: [{
          taskId: -1,
          taskName: "",
          projectId: -1,
          projectName: "",
          id: -1,
          name: "",
          startDate: -1,
          endDate: -1,
          timeType: -1,
        }]
      },
      member: {
        status: -1,
        data: [{
          userId: -1
        }]
      },
      showDelete: false,
      formSubmitted: false,
      showAdd: false,
      invalidStartDate: false,
      invalidEndDate: false,
      assignedToUser: {id: 1, name: ''},
      buttonDisabled: true,
      users: {
        status: -1,
        data: [{
          id: -1,
          email: '',
          firstName: '',
          lastName: '',
          group: -1
        }]
      },
      timeTypes: {
        status: -1,
        data: [{
          id: -1,
          name: ''
        }]
      }
    };
    this.handleAddClose = this.handleAddClose.bind(this)
    this.handleAddShow = this.handleAddShow.bind(this)
    this.handleDeleteShow = this.handleDeleteShow.bind(this)
    this.handleDeleteClose = this.handleDeleteClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleValidity = this.handleValidity.bind(this)
  }
  deleteTaskId: number = Infinity;

  componentDidMount() {
    this.getInformation()
  }

  /**
   * Gets information to be used in componentDidMount().
   * Gets information about: projects, tasks, users and timetypes
   */
  getInformation() {
    let apiHandler = new BaseApiHandler();
    apiHandler.get(`/api/task/project/get?project=${id}`,{}, (value) => {
      let json:TaskProjectApi = JSON.parse(JSON.stringify(value))
      this.setState({task: json})
      let id = []
      for (const task of json.data) {
        id.push(task.taskId)
      }
      //Gets tasks for those on the project
      apiHandler.get(`/api/task/get?ids=${id}`, {}, (tasks) => {
        let json:Api = JSON.parse(JSON.stringify(tasks))
        this.setState({task: json})
      })
      //Gets information about the current project
      apiHandler.get(`/api/project/info/get?ids=${id}`,{}, (value) => {
        let member:MemberApi = JSON.parse(JSON.stringify(value))
        this.setState({member: member})
      })
      //Gets all users in the database
      apiHandler.get(`/api/user/get?ids=*`,{}, (value) => {
        let user:UserApi = JSON.parse(JSON.stringify(value))
        this.setState({users: user})
      })
      //Gets all the available timetypes
      apiHandler.get(`/api/timetype/get?ids=*`,{}, (value) => {
        let timeType:TimeApi = JSON.parse(JSON.stringify(value))
        this.setState({timeTypes: timeType})
      })
    })
  }

  /**
   * sets the state of formData to whichever is currently in the input field
   */
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      formData: { ...this.state.formData, [event.target.name]: event.target.value },
    });
  };

  /**
   * sets the state of formData to whichever is currently in the input field using a selector
   */
  handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      formData: { ...this.state.formData, [event.target.name]: event.target.value },
    });
  };

  /**
   * This handles the modal closing whenever you click the delete button
   */
  private handleDeleteClose(){
    this.setState({
      showDelete: false
    });
  }

  /**
   * This handles the modal showing whenever you click the delete button
   */
  private handleDeleteShow(){
    this.setState({
      showDelete: true
    })
  }

  /**
   * This handles the modal closing whenever you click the submit button
   */
  private handleAddClose(){
    this.setState({
      showAdd: false
    })
  }
  /**
   * This handles the modal showing whenever you click the submit button
   */
  private handleAddShow(){
    if (this.state.buttonDisabled === false){
      this.setState({
        showAdd: true
      })
    }
  }

  /**
   * This handles the button being disabled
   */
  private handleButtonDisable() {
    this.setState({
      buttonDisabled: true
    })
  }

  /**
   * This handles the button being enabled
   */
  private handleButtonEnable() {
    this.setState({
      buttonDisabled: false
    })
  }

  /**
   * Handles the validity of the input form and data from dynamic table.
   * This disables the button if the form is not correctly inputted
   */
  private handleValidity() {
    const button = document.getElementById("submitbutton") as HTMLInputElement | null;
    const addButton = document.getElementById("addButton") as HTMLInputElement | null;
    const taskName = (document.getElementById("formTaskName") as HTMLInputElement).value
    const startDate = new Date((document.getElementById("formStartDate") as HTMLInputElement).value)
    const endDate = new Date((document.getElementById("formEndDate") as HTMLInputElement).value)
    const timeType = (document.getElementById("formTimeType") as HTMLInputElement).value
    const user = this.state.formData.userId

    //RegEx to determine invalid inputs
    let invalidTaskName = /^\s/g.test(taskName) || taskName === ''
    let invalidDate = !/\d/g.test(startDate.toString()) || !/\d/g.test(endDate.toString())
    let invalidTimeType = /\D/g.test(timeType) || timeType === ''
    let invalidUser = !(user.length > 0)

    //Checks if the input fields contains an invalid input
    if ((invalidTaskName || invalidDate || this.state.invalidStartDate || this.state.invalidEndDate || invalidTimeType
    || invalidUser) || this.state.rows.length < 0){
      addButton?.setAttribute('disabled', '')
    }
    else {
      addButton?.removeAttribute('disabled')
    }
    button?.setAttribute('disabled', '')

    //This checks if the table rows inputted are invalid if they somehow got past the other invalid check
    if (this.state.rows.length > 0) {
      for (let i = 1; this.state.rows.length >= i; i++) {
        let invalidRowTaskName = /^\s/g.test(this.state.rows[i - 1].taskName) || this.state.rows[i - 1].taskName === ''
        let invalidRowDate = !/\d/g.test(this.state.rows[i - 1].startDate.toString()) || !/\d/g.test(this.state.rows[i - 1].endDate.toString())

        if ((invalidRowTaskName || invalidRowDate || this.state.invalidStartDate || this.state.invalidEndDate || /\D/g.test(this.state.rows[i - 1].timeType)
        ) || this.state.rows.length < 0) {

          button?.setAttribute('disabled', '')
        }
        else {
          button?.removeAttribute('disabled')
        }
      }
    }
  }

  /**
   * This handles the buttonValidity, so you can't get through disabled using inspect element
   */
  private handleButtonValidity() {
    const button = document.getElementById("submitbutton") as HTMLInputElement | null;

    button?.setAttribute('disabled', '')
    if (this.state.rows.length > 0) {
      for (let i = 1; this.state.rows.length >= i; i++) {
        let invalidRowTaskName = /^\s/g.test(this.state.rows[i - 1].taskName) || this.state.rows[i - 1].taskName === ''
        let invalidRowDate = !/\d/g.test(this.state.rows[i - 1].startDate.toString()) || !/\d/g.test(this.state.rows[i - 1].endDate.toString())

        if ((invalidRowTaskName || invalidRowDate || this.state.invalidStartDate || this.state.invalidEndDate || /\D/g.test(this.state.rows[i - 1].timeType)
        ) || this.state.rows.length < 0) {

          button?.setAttribute('disabled', '')
          this.handleButtonDisable()
        }
        else {
          button?.removeAttribute('disabled')
          this.handleButtonEnable()
        }
      }
    }
  }

  /**
   * Handles the endDate, this is used for validating if the endDate is valid
   */
  private handleEndDate(){
    const startDate = new Date((document.getElementById("formStartDate") as HTMLInputElement).value)
    const endDate = new Date((document.getElementById("formEndDate") as HTMLInputElement).value)
    let maxDate: Date = new Date("3000-01-01")
    let minDate: Date = new Date("1970-01-01")

    if (!(minDate > endDate || endDate > maxDate || startDate > endDate)){
      this.setState({invalidEndDate : false})
    }
    else {
      this.setState({invalidEndDate : true})
    }
  }

  /**
   * Handles the startDate, this is used for validating if the startDate is valid
   */
  private handleStartDate(){
    const startDate = new Date((document.getElementById("formStartDate") as HTMLInputElement).value)
    const endDate = new Date((document.getElementById("formEndDate") as HTMLInputElement).value)
    let maxDate: Date = new Date("3000-01-01")
    let minDate: Date = new Date("1970-01-01")

    if (!(startDate > endDate || startDate > maxDate || minDate > startDate)){
      this.setState({invalidStartDate : false})
    }
    else {
      this.setState({invalidStartDate : true})
    }
  }

  /**
   * This handles the Submit.
   * Submits the data to the table, creating a new row
   */
  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //Sets the New rows to the data inputted
    const newRows = [...this.state.rows, this.state.formData];
    //Sets the state of the rows to the newRows, and the formData to default
    this.setState({
      rows: newRows,
      formData: {
        taskName: "",
        startDate: "",
        endDate: "",
        timeType: "1",
        userId: this.state.formData.userId
      },
    });
    if (this.props.onRowsUpdate) {
      this.props.onRowsUpdate(newRows);
    }
    setTimeout(() =>{
      this.handleValidity()
    }, 200)
  };

  /**
   * This handles the delete button to delete a row when creating tasks
   */
  handleDelete = (index: number) => {
    const newRows = this.state.rows.filter((_, i) => i !== index);
    this.setState({
      rows: newRows,
    });
    if (this.props.onRowsUpdate) {
      this.props.onRowsUpdate(newRows);
    }
    setTimeout(() =>{
      this.handleValidity()
    }, 200)
  };

  /**
   * This handles the currently selected manager while still retaining the correct formData
   */
  private handleManager(user: {id: number, name: string}[]): void {
    this.setState({
      formData: {
        taskName: this.state.formData.taskName,
        startDate: this.state.formData.startDate,
        endDate: this.state.formData.endDate,
        timeType: this.state.formData.timeType,
        userId: user.map((value) =>{
          return value.id.toString()
        })}
    })
  }

  /**
   * This handles the post data request.
   * Posts the data to the database.
   * Also changes formSubmitted state, so it shows an alert
   */
  handlePostData = () => {
    // eslint-disable-next-line array-callback-return
    this.state.rows.map((row => {
      let taskName = row.taskName
      let startDate = new Date(row.startDate).getTime();
      let endDate = new Date(row.endDate).getTime();
      let timeType = parseInt(row.timeType)
      let userId = row.userId.filter((value) =>{
        return parseInt(value)
      })

      let post_data = {
        projectId: id,

        task : {
          name: taskName,
          userId: userId,
          startDate: startDate,
          endDate: endDate,
          timeType: timeType
        }
      }
      let apiHandler = new BaseApiHandler();
      apiHandler.post(`/api/task/creation/post`, {body:post_data}, () =>{
        this.getInformation()
      })
      this.setState({formSubmitted: true})
      this.handleAddClose()
      //After submitting sets the table and formData to default values
      this.setState({ rows: this.props.initialRows,
        formData: {
          taskName: "",
          startDate: "",
          endDate: "",
          timeType: "1",
          userId: [""]
        },
        assignedToUser: {id: 1, name: ''}
      },)
    }))
    setTimeout (()=> {
      this.setState({formSubmitted: false})

    },4000)
  };

  /**
   * This handles the post data request.
   * Posts the data to the database, which results in deleting a task.
   * Also changes formSubmitted state, so it shows an alert
   */
  handleDeleteData = (event: any) => {
    if (event.target.id !== "deletebutton") {
      this.deleteTaskId =  parseInt(event.target.id)
    }

    if (event.target.id === "deletebutton"){
      const post_data = {
        taskId: this.deleteTaskId,
        delete: id
      }
      let apiHandler = new BaseApiHandler();
      apiHandler.put(`/api/task/edit/put`, {body:post_data}, () =>{
        this.getInformation()
      })
      this.setState({formSubmitted: true})
      this.handleDeleteClose()
      setTimeout (()=> {
        this.setState({formSubmitted: false})

      },4000)
    }
  }

  /**
   * This maps and renders information to a table
   */
  private tableRender():JSX.Element[] {
    return this.state.task.data.map(row => (
        <tr key={row.id}>
          <td>{row.id ?? ''}</td>
          <td>{row.name ?? ''}</td>
          <td>{row.startDate ? new Date(row.startDate).toLocaleDateString() : ''}</td>
          <td>{row.endDate ? new Date(row.endDate).toLocaleDateString() : ''}</td>
          <td>{row.timeType ?? ''}</td>
        </tr>
    ))
  }
  /**
   * This maps and renders information to the table which will be used to delete tasks
   */
  private tableRenderDelete():JSX.Element[] {
    return this.state.task.data.map(row => (
        <tr key={row.id}>
          <td>{row.id ?? ''}</td>
          <td>{row.name ?? ''}</td>
          <td>{row.startDate ? new Date(row.startDate).toLocaleDateString() : ''}</td>
          <td>{row.endDate ? new Date(row.endDate).toLocaleDateString() : ''}</td>
          <td>{row.timeType ?? ''}</td>
          {userInfo.isProjectLeader ? (<td><Button id={row.id?.toString()} variant="danger" className="p-2" onClick={(event) => {this.handleDeleteShow(); this.handleDeleteData(event);}}>Delete</Button></td>): null }
        </tr>
    ))
  }

  /**
   * Renders the HTML elements
   * Using tabs, form, selector and a typeahead.
   * Also renders the tables for the corresponding pages.
   */
  render(){
    const {rows, formData} = this.state
    return (
        <>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={2}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="first">Create task</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">Delete task</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <Row>
                  <Col sm={2}></Col>
                  <Col>
                    <Container>
                      <h1>Create task</h1>
                      <Form onSubmit={this.handleSubmit}>
                        <InputGroup>
                          <Form.Group controlId="formTaskName" onChange={this.handleValidity}>
                            <Form.Label>Task Name:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Task Name"
                                name="taskName"
                                maxLength={49}
                                value={formData.taskName}
                                onChange={this.handleChange}
                            />
                          </Form.Group>
                          <Form.Group controlId="formStartDate" onChange={() =>{this.handleValidity.call(this); this.handleStartDate.call(this)}}>
                            <Form.Label>Start Date:</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Start Date"
                                name="startDate"
                                min="1970-01-01"
                                max="3000-01-01"
                                value={formData.startDate}
                                onChange={this.handleChange}
                                isInvalid={this.state.invalidStartDate}
                            />
                            <Form.Control.Feedback type="invalid">
                              {<p><b>Date is invalid</b></p>}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group controlId="formEndDate" onChange={() => {this.handleValidity.call(this); this.handleEndDate.call(this)}}>
                            <Form.Label>End Date:</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="End Date"
                                name="endDate"
                                min="1970-01-01"
                                max="3000-01-01"
                                value={formData.endDate}
                                onChange={this.handleChange}
                                isInvalid={this.state.invalidEndDate}
                            />
                            <Form.Control.Feedback type="invalid">
                              {<p><b>Date is invalid</b></p>}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group controlId="formTimeType" onChange={this.handleValidity}>
                            <Form.Label>Time Type:</Form.Label>
                            <Form.Select
                                placeholder="Time Type"
                                name="timeType"
                                value={formData.timeType}
                                onChange={this.handleSelectChange}
                                onBlur={this.handleSelectChange}
                                onInput={this.handleSelectChange}
                                onSelect={this.handleSelectChange}
                            >
                              {this.state.timeTypes.data.map((row) => {
                                return (<option value={row.id?.toString()}>{row.id}: {row.name}</option>)
                              })}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group controlId="formUserID" onChange={this.handleValidity}>
                            <Form.Label>User:</Form.Label>
                            <Typeahead
                                id="chooseUser"
                                labelKey="name"
                                multiple
                                placeholder="Choose User(s)..."
                                options={
                                  this.state.users.data.map(row =>({id: row.id, name: row.firstName + " " + row.lastName}))
                                }
                                onMenuToggle={() => {this.handleValidity.call(this)}}
                                onChange={(value) => {this.handleManager.call(this, value as {id: number, name:string}[]);
                                  this.handleValidity.call(this);}}
                                filterBy={(option: any, props: any): boolean => {
                                  const query: string = props.text.toLowerCase().trim();
                                  const name: string = option.name.toLowerCase();
                                  const id: string = option.id.toString();
                                  return name.includes(query) ||  id.includes(query);
                                }}
                                renderMenuItemChildren={(option: any, props: any) => (
                                    <>
                                      <Highlighter search={props.text}>
                                        {option.name}
                                      </Highlighter>
                                      <div>
                                        <small>User id: {option.id}</small>
                                      </div>
                                    </>
                                )}
                            />
                          </Form.Group>
                          <Row>
                            <Col>
                              <Button variant="primary" type="submit" id="addButton" disabled className="p-4">
                                Add
                              </Button>
                            </Col>
                          </Row>
                        </InputGroup>
                      </Form>
                    </Container>


                    <Container className="pt-5">
                      <Table striped bordered hover>
                        <thead>
                        <tr>
                          <th>Task Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Time Type</th>
                          <th>User ID</th>
                          <th>&#128465;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                              <td>{row.taskName}</td>
                              <td>{row.startDate}</td>
                              <td>{row.endDate}</td>
                              <td>{row.timeType}</td>
                              <td>{row.userId}</td>
                              <td>
                                <Button variant="danger" onClick={() => this.handleDelete(index)}>
                                  Delete
                                </Button>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </Table>
                    </Container>
                    <Container>
                      <Table bordered hover>
                        <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Time Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.tableRender()}
                        </tbody>
                      </Table>
                      <Modal show={this.state.showAdd} onHide={this.handleAddClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Create task(s)</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to create this task(s)?</Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleAddClose}>
                            Close
                          </Button>
                          <Button variant="success" type="submit" id="submitbutton" onClick={this.handlePostData}>Create</Button>
                        </Modal.Footer>
                      </Modal>
                    </Container>
                    <center>
                      <Button variant="success" id="submitbutton" onClick={() =>{this.handleAddShow.call(this); this.handleButtonValidity()}} className="px-5">Submit task(s)</Button>
                    </center>
                    {this.state.formSubmitted ? (<Alert variant="success" id="alert">
                      <Alert.Heading>Task(s) added</Alert.Heading>
                      <p>
                        Your task(s) has been successfully created, it can be viewed under <a href={`project/viewer?id=${id}`}>project</a>
                      </p>
                    </Alert>) : ""}
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <Row>
                  <Col sm={2}></Col>
                  <Col>
                    <Container>
                      <h1>Delete task</h1>
                      <Table bordered hover>
                        <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Time Type</th>
                          <th>&#128465;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.tableRenderDelete()}
                        </tbody>
                      </Table>
                      <Modal show={this.state.showDelete} onHide={this.handleDeleteClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Delete task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleDeleteClose}>
                            Close
                          </Button>
                          <Button variant="danger" type="submit" id="deletebutton" onClick={this.handleDeleteData}>Delete</Button>
                        </Modal.Footer>
                      </Modal>
                    </Container>
                    {this.state.formSubmitted ? (<Alert variant="danger" id="alert">
                      <Alert.Heading>Task(s) deleted!</Alert.Heading>
                      <p>
                        Your task has been successfully deleted!
                      </p>
                    </Alert>) : ""}
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </>
    );
  };
}



export default CreateTaskTable
