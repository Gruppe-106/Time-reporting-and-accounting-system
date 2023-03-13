/*
    Show a singular user and the time for that week, potentially add going back in time
 */


import {Component} from "react";
import ReactDOM from "react-dom/client";

class UserTimeApproval extends Component<any>{
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
    <UserTimeApproval></UserTimeApproval>
)