import React, { Component } from 'react';
import { Container, Form } from "react-bootstrap";
import TimeSheetPage from "./userCom";
import BaseApiHandler from "../../../network/baseApiHandler";
import { UserState, UserAPI } from "./interfaces"

class UserTimeSheet extends Component<{}, UserState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      userId: 0,
      dataOfUser: []
    };
  }

  private handleSelectChange(value: string) {
    const newId = parseInt(value);
    this.setState({ userId: newId });
  }

  /**
   * Fetches user data from the API and updates the state with the response data.
   */
  componentDidMount() {
    let apiHandler = new BaseApiHandler();
    // Call the API to fetch user data
    apiHandler.get(
      `/api/user/get?ids=*&var=id,firstName,lastName`, {},
      (value) => {
        // Parse the response JSON
        let json: UserAPI = JSON.parse(JSON.stringify(value));
        // If the API call was successful (status code 200), update the state with the fetched data
        if (json.status === 200) {
          this.setState({ dataOfUser: json.data })
        }
      }
    );
  }

  /**
   * Renders the TimeSheetPage component with the selectedUser prop if a user is selected.
   * @returns The TimeSheetPage component if a user is selected, otherwise nothing is rendered.
   */
  private renderTimeSheet() {
    const { userId, dataOfUser } = this.state;
    const selectedUser = userId;

    if (selectedUser > 0) {
      return <TimeSheetPage key={selectedUser} userId={selectedUser} adminPicked={true} />;
    }
    console.log(dataOfUser)
  }

  render() {
    const { dataOfUser } = this.state;
    return (
      <Container fluid="sm">
        <Form.Select onChange={(e) => this.handleSelectChange(e.target.value)}>
          <option key={0}>Select user</option>
          {dataOfUser.map((item) => {
            return (
              <option key={item.id} value={item.id}>{item.firstName} {item.lastName}, {item.id}</option>
            );
          })}
        </Form.Select>
        {this.renderTimeSheet()}
      </Container>
    );
  }
}

export default UserTimeSheet;