/*
    Show single project
 */

import {Component} from "react";
import ReactDOM from "react-dom/client";

class ProjectViewer extends Component<any>{
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
    <ProjectViewer></ProjectViewer>
)

export {};