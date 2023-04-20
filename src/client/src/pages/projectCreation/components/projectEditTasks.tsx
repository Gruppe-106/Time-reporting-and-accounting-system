import React, {Component} from "react";
import {Table, Button, Form, InputGroup, Row, Col, Container, Tab} from "react-bootstrap";
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
  show?: boolean
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
      show: false,
      formSubmitted: false
    };
    this.handleClose = this.handleClose.bind(this)
    this.handleShow = this.handleShow.bind(this)
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
      console.log(value)
      //Then convert the string to the expected object(eg. )
      let json:TaskProjectApi = JSON.parse(JSON.stringify(value))
      //Then update states or variables or whatever you want with the information
      this.setState({task: json})
      console.log(json)
      let id = []
      for (const task of json.data) {
        id.push(task.taskId)
      }
      apiHandler.get(`/api/task/get?ids=${id}`, {}, (tasks) => {
        console.log(tasks)
        let json:Api = JSON.parse(JSON.stringify(tasks))
        this.setState({task: json})
        console.log(json)
      })
      apiHandler.get(`/api/project/info/get?ids=${id}`,{}, (value) => {
        console.log(value)
        //Then convert the string to the expected object(eg. )
        let member:MemberApi = JSON.parse(JSON.stringify(value))
        //Then update states or variables or whatever you want with the information
        this.setState({member: member})
        console.log(member)
      })
    })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      formData: { ...this.state.formData, [event.target.name]: event.target.value },
    });
  };

  private handleClose(){
    this.setState({
      show: false
    });
  }

  private handleShow(){
    this.setState({
      show: true
    })
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
  };

  handleDelete = (index: number) => {
    const newRows = this.state.rows.filter((_, i) => i !== index);
    this.setState({
      rows: newRows,
    });
    if (this.props.onRowsUpdate) {
      this.props.onRowsUpdate(newRows);
    }
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
        task: {
          name: taskName,
          userId: userId,
          startDate: startDate,
          endDate: endDate,
          timeType: timeType
        }
      }
      let apiHandler = new BaseApiHandler();
      apiHandler.post(`/api/task/creation/post`, {body:post_data}, (value) =>{
        console.log(value);
      })
      this.getInformation()
    }))

  };

  handleDeleteData = (event: any) => {
    if (event.target.id !== "submitbutton") {
      this.deleteTaskId =  parseInt(event.target.id)
      console.log(this.deleteTaskId)
    }

    if (event.target.id === "submitbutton"){
        console.log("test")
        const post_data = {
          taskId: this.deleteTaskId,
          delete: true
        }
        console.log(post_data)
        let apiHandler = new BaseApiHandler();
        apiHandler.put(`/api/task/edit/put`, {body:post_data}, (value) =>{
          console.log(value);


        })
        this.setState({formSubmitted: true})
        this.handleClose()
        this.getInformation()
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
          {userInfo.isProjectLeader ? (<td><Button id={row.id?.toString()} variant="danger" className="p-2" onClick={(event) => {this.handleShow(); this.handleDeleteData(event);}}>Delete</Button></td>): null }
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
                          <Form.Control
                              type="text"
                              placeholder="Task Name"
                              name="taskName"
                              maxLength={49}
                              value={formData.taskName}
                              onChange={this.handleChange}
                          />
                          <Form.Control
                              type="date"
                              placeholder="Start Date"
                              name="startDate"
                              value={formData.startDate}
                              onChange={this.handleChange}
                          />
                          <Form.Control
                              type="date"
                              placeholder="End Date"
                              name="endDate"
                              value={formData.endDate}
                              onChange={this.handleChange}
                          />
                          <Form.Control
                              type="number"
                              placeholder="Time Type"
                              name="timeType"
                              value={formData.timeType}
                              min="1"
                              max="4"
                              onChange={this.handleChange}
                          />
                          <Form.Control
                              type="number"
                              placeholder="User ID"
                              name="userId"
                              value={formData.userId}
                              onChange={this.handleChange}
                          />
                          <Button variant="primary" type="submit">
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
                    </Container>
                    <center>
                      <Button variant="success" onClick={this.handlePostData} className="px-5">Submit task(s)</Button>
                    </center>
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
                      <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Delete task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleClose}>
                            Close
                          </Button>
                          <Button variant="danger" type="submit" id="submitbutton" onClick={this.handleDeleteData}>Delete</Button>
                        </Modal.Footer>
                      </Modal>
                    </Container>
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
