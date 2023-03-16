import React, { Component } from 'react';

interface Person {
  name: string;
  age: number;
  email: string;
}

interface Props {}

interface State {
  data: Person[];
}

class TableRow extends Component<{ data: Person }> {
  render() {
    const { data } = this.props;

    return (
      <tr>
        <td>{data.name}</td>
        <td>{data.age}</td>
        <td>{data.email}</td>
      </tr>
    );
  }
}

class Table extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: [
        { name: 'John', age: 25, email: 'john@example.com' },
        { name: 'Jane', age: 30, email: 'jane@example.com' },
      ],
    };

    this.addRow = this.addRow.bind(this);
  }

  addRow() {
    const { data } = this.state;

    this.setState({
      data: [
        ...data,
        { name: 'New Person', age: 0, email: '' },
      ],
    });
  }

  renderRows() {
    const { data } = this.state;

    return data.map((item, index) => (
      <TableRow key={index} data={item} />
    ));
  }

  render() {
    return (
      <div>
        <button onClick={this.addRow}>Add Row</button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table