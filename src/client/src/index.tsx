import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import Test from "./components/test";
import {Container, Nav, Navbar} from 'react-bootstrap';
export { default as AdminPanel } from "./pages/adminPanel/adminPanel";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <Navbar>
          <Navbar.Brand>Test</Navbar.Brand>
          <Nav.Link href={"/AdminPanel"}>Admin</Nav.Link>
      </Navbar>
      <Container>
          <h1>Time management</h1>
          <ArrayTest/>
      </Container>
  </React.StrictMode>
);

function ArrayTest():JSX.Element {
    return (
        <>{[
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
    ].map((variant) => (
        <Test name={variant}/>
    ))}</>)
}
