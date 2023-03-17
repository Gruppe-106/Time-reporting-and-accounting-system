import {Table} from "react-bootstrap";
import React, {Component} from "react";
import BaseApiHandler from "../../../network/baseApiHandler";

interface TimeRegisterData {
  taskId?: number;
  taskName?: string;
  projectName?: string;
}

interface State {
  tableRows: TimeRegisterData[];
}

class MyComponent extends Component<{}, State> {
  state: State = {
    tableRows: [],
  };

  componentDidMount() {
    let apiHandler = new BaseApiHandler("fuldstændigligemeget");
    apiHandler.get(
      `api/time/register/get?user=1&var=taskName,taskId,projectName`,
      (value) => {
        let json: TimeRegisterData[] = JSON.parse(JSON.stringify(value));
        this.setState({tableRows: json});
      }
    );
  }
  //  ?? "" is nullish coalescing operator, returns its right-hand side operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.
  private tableRender(): JSX.Element[] {
    return this.state.tableRows.map((row) => (
      <tr key={row.taskId}>
        <td>{row.taskId ?? "Did not find data"}</td>
        <td>{row.taskName ?? "Did not find data"}</td>
        <td>{row.projectName ?? "Did not find data"}</td>
      </tr>
    ));
  }

  render() {
    return (
      <Table bordered hover>
        <thead>
          <tr>
            <th>TaskID</th>
            <th>Tast Name</th>
            <th>Project Name</th>
          </tr>
        </thead>
        <tbody>{this.tableRender()}</tbody>
      </Table>
    );
  }
}

export default MyComponent;
