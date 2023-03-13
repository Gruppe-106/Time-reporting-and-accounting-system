/*
    Button that exports file in the given month
    *Maybe filters if time allows*
 */

import React, {Component} from "react";
import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";

class DataExport extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>DataExport</h1>
                </Container>
            </>
        );
    }
}

export default DataExport;