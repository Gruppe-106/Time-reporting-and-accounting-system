/*
    Button that exports file in the given month
    *Maybe filters if time allows*
 */

import {Component} from "react";
import ReactDOM from "react-dom/client";

class DataExport extends Component<any>{
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
    <DataExport></DataExport>
)