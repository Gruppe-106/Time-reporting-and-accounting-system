/*
    Show a list of projects a user is related to
 */

import {Component} from "react";
import ReactDOM from "react-dom/client";

class ProjectMenu extends Component<any>{
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
    <ProjectMenu></ProjectMenu>
)