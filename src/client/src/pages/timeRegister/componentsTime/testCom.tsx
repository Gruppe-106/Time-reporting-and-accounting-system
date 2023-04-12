import React, { Component } from "react";

interface ListItem {
  id: number;
  name: string;
  age: number;
}

interface ListProps {
  items: ListItem[];
}

class List extends Component<ListProps> {
  render() {
    const { items } = this.props;

    return (
      <div>
        <h1>List Items</h1>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <div>Name: {item.name}</div>
              <div>Age: {item.age}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

// Usage
const listItems: ListItem[] = [
  { id: 1, name: "John", age: 25 },
  { id: 2, name: "Jane", age: 30 },
  { id: 3, name: "Alice", age: 28 },
];

class App extends Component {
  render() {
    return (
      <div>
        <List items={listItems} />
      </div>
    );
  }
}

export default App;