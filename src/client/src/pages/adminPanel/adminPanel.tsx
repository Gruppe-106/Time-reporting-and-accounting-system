/*
    Main board for showing all options for the admin of the page
    *Potentials*
    Add user editor
    Custom roles
    ...
*/

import {Component} from "react";
import ReactDOM from "react-dom/client";

class AdminPanel extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <h1>test</h1>
        );
    }

}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <AdminPanel></AdminPanel>
)

export default AdminPanel;