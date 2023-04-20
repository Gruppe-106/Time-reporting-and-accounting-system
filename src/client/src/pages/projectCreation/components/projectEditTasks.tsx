import React, {Component} from "react";
import {Table, Button, Form, InputGroup, Row, Col, Container, Tab, Alert} from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";
import Nav from "react-bootstrap/Nav";
import {userInfo} from "../../../utility/router";
import Modal from "react-bootstrap/Modal";

interface TableRow {
  taskName: string;
  startDate: string;
  endDate: string;
  timeType: string;
  userId: string;
}

interface DynamicTableState {
  rows: TableRow[];
  formData: TableRow;
  task: TaskProjectApi;
  member: MemberApi;
  formSubmitted?: boolean;
  showDelete?: boolean
  showAdd?: boolean
  invalidStartDate: boolean,
  invalidEndDate: boolean
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
        timeType: "",
        userId: ""
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
      invalidEndDate: false
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

  getInformation() {
    //First make an instance of the api handler, give it the auth key of the user once implemented
    let apiHandler = new BaseApiHandler();
    //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
    //Callbacks can be used to tell what to do with the data once it's been retrieved
    apiHandler.get(`/api/task/project/get?project=${id}`,{}, (value) => {
      //Then convert the string to the expected object(eg. )
      let json:TaskProjectApi = JSON.parse(JSON.stringify(value))
      //Then update states or variables or whatever you want with the information
      this.setState({task: json})
      let id = []
      for (const task of json.data) {
        id.push(task.taskId)
      }
      apiHandler.get(`/api/task/get?ids=${id}`, {}, (tasks) => {
        let json:Api = JSON.parse(JSON.stringify(tasks))
        this.setState({task: json})
      })
      apiHandler.get(`/api/project/info/get?ids=${id}`,{}, (value) => {
        //Then convert the string to the expected object(eg. )
        let member:MemberApi = JSON.parse(JSON.stringify(value))
        //Then update states or variables or whatever you want with the information
        this.setState({member: member})
      })
    })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      formData: { ...this.state.formData, [event.target.name]: event.target.value },
    });
  };

  private handleDeleteClose(){
    this.setState({
      showDelete: false
    });
  }

  private handleDeleteShow(){
    this.setState({
      showDelete: true
    })
  }

  private handleAddClose(){
    this.setState({
      showAdd: false
    })
  }
  private handleAddShow(){
    this.setState({
      showAdd: true
    })
  }

  private handleValidity() {
    const button = document.getElementById("submitbutton") as HTMLInputElement | null;
    const addButton = document.getElementById("addButton") as HTMLInputElement | null;
    const taskName = (document.getElementById("formTaskName") as HTMLInputElement).value
    const startDate = new Date((document.getElementById("formStartDate") as HTMLInputElement).value)
    const endDate = new Date((document.getElementById("formEndDate") as HTMLInputElement).value)
    const timeType = (document.getElementById("formTimeType") as HTMLInputElement).value
    const userId = (document.getElementById("formUserID") as HTMLInputElement).value

    if ((/^\s/g.test(taskName) || taskName === '' || !/\d/g.test(startDate.toString()) || !/\d/g.test(endDate.toString()) || this.state.invalidStartDate || this.state.invalidEndDate || /\D/g.test(timeType) || /\D/g.test(userId) || timeType === '' || userId === '') || this.state.rows.length < 0){
      addButton?.setAttribute('disabled', '')
    }
    else {
      addButton?.removeAttribute('disabled')
    }

    if (this.state.rows.length > 0) {
      for (let i = 1; this.state.rows.length >= i; i++) {
        if (/^\s/g.test(this.state.rows[i - 1].taskName) || this.state.rows[i - 1].taskName === '' || !/\d/g.test(this.state.rows[i - 1].startDate.toString()) || !/\d/g.test(this.state.rows[i - 1].endDate.toString()) || this.state.invalidStartDate || this.state.invalidEndDate || /\D/g.test(this.state.rows[i - 1].timeType) || /\D/g.test(this.state.rows[i - 1].userId) || this.state.rows[i - 1].timeType === '' || this.state.rows[i - 1].userId === '' || this.state.rows.length < 0) {
          button?.setAttribute('disabled', '')
        } else {
          button?.removeAttribute('disabled')
        }
      }
    }




  }

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

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newRows = [...this.state.rows, this.state.formData];
    this.setState({
      rows: newRows,
      formData: {
        taskName: "",
        startDate: "",
        endDate: "",
        timeType: "",
        userId: ""
      },
    });
    if (this.props.onRowsUpdate) {
      this.props.onRowsUpdate(newRows);
    }
    setTimeout(() =>{
      this.handleValidity()
    }, 200)
  };

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

  handlePostData = () => {
    // eslint-disable-next-line array-callback-return
    this.state.rows.map((row => {
      let taskName = row.taskName
      let startDate = row.startDate
      let endDate = row.endDate
      let timeType = parseInt(row.timeType)
      let userId = [parseInt(row.userId)]

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
      apiHandler.post(`/api/task/creation/post`, {body:post_data}, (value) =>{
        this.getInformation()
      })
      this.setState({formSubmitted: true})
      this.handleAddClose()
      this.setState({ rows: this.props.initialRows,
        formData: {
          taskName: "",
          startDate: "",
          endDate: "",
          timeType: "",
          userId: ""
        },})
    }))
  };

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
      apiHandler.put(`/api/task/edit/put`, {body:post_data}, (value) =>{
        this.getInformation()
      })

      this.setState({formSubmitted: true})
      this.handleDeleteClose()
    }
  }

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
                            <Form.Control
                                type="number"
                                placeholder="Time Type"
                                name="timeType"
                                value={formData.timeType}
                                min="1"
                                max="4"
                                onChange={this.handleChange}
                            />
                          </Form.Group>
                          <Form.Group controlId="formUserID" onChange={this.handleValidity}>
                            <Form.Control
                                type="number"
                                placeholder="User ID"
                                name="userId"
                                value={formData.userId}
                                onChange={this.handleChange}
                            />
                          </Form.Group>
                          <Button variant="primary" type="submit" id="addButton" disabled>
                            Add
                          </Button>
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
                      <Button variant="success" id="submitbutton" onClick={this.handleAddShow} className="px-5" disabled>Submit task(s)</Button>
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
                        Your task has been successfully deleted, it can be viewed under <a href={`project/viewer?id=${id}`}>project</a>
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
