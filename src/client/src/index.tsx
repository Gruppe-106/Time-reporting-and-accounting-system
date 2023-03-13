import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from "./utility/router";

/*             === Beware ===
 *   This component will not be rendered.
 *   It's used as the entrypoint for the dev server and will use the router to direct the user.
 *   The index page is located in frontPage folder
 */

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <Router/>
  </React.StrictMode>
);