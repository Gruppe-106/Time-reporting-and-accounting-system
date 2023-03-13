/*
    Editing of projects by its respective project leader
 */

import {Component} from "react";
import ReactDOM from "react-dom/client";

class ProjectManager extends Component<any>{
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
    <ProjectManager></ProjectManager>
)