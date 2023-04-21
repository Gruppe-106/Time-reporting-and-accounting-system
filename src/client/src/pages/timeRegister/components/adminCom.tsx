import React, { Component } from 'react';
import { Container, Form } from "react-bootstrap";
import TimeSheetPage from "./userCom";
import { UserState } from "./interfaces"

class UserTimeSheet extends Component<{}, UserState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      userId: 0,
    };
  }

  private handleSelectChange(value: string) {
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