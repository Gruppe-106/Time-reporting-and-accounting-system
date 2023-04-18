import React, {Component, useState} from "react";
import { Table, Button, Form, InputGroup, Row, Col, Container } from "react-bootstrap";
import BaseApiHandler from "../../../network/baseApiHandler";

interface TableRow {
  taskName: string;
  startDate: string;
  endDate: string;
  timeType: number;
  userId: number;
}

interface ProjectInformationProp {
  id:number
  superProjectId?:number
  name?:string
  startDate?:string
  endDate?:string

}

interface DynamicTableState {
  rows: TableRow[];
  formData: TableRow;
  task: TaskProjectApi;
  member: MemberApi;
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
  }[],
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
        timeType: Infinity,
        userId: Infinity
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
      }
    };
  }


  componentDidMount() {
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

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newRows = [...this.state.rows, this.state.formData];
    this.setState({
      rows: newRows,
      formData: {
        taskName: "",
        startDate: "",
        endDate: "",
        timeType: Infinity,
        userId: Infinity
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
          let timeType = row.timeType
          let userId = [row.userId]

          let post_data = {
            name: taskName,
            userId: userId,
            startDate: startDate,
            endDate: endDate,
            timeType: timeType
        }
         let apiHandler = new BaseApiHandler();
        apiHandler.post(`/api/task/creation/post`, {body:post_data}, (value) =>{
            console.log(value);
        })
        }))

  };

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

  render(){
    const {rows, formData} = this.state
    return (
        <>
          <Container>
            <Form onSubmit={this.handleSubmit}>
              <Row>
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
              </Row>
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
          <Button variant="info" onClick={this.handlePostData}>Test</Button>
        </>
    );
  };
}



export default CreateTaskTable
