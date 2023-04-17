/*
    Button that exports file in the given month
    *Maybe filters if time allows*
 */

import React, {Component} from "react";
import ReactDOM from "react-dom/client";
import BaseNavBar from "../../components/navBar";
import {Button, Container} from "react-bootstrap";
import BaseApiHandler from "../../network/baseApiHandler";

class DataExport extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <Button onClick={() => {
                        let apiHandler = new BaseApiHandler();
                        apiHandler.get("/api/", {}, (value) => {console.log(value)});
                        apiHandler.post("/api/", {}, (value) => {console.log(value)});
                        apiHandler.put("/api/", {}, (value) => {console.log(value)});
                        apiHandler.delete("/api/", {}, (value) => {console.log(value)});
                    }
                    }></Button>
                    <h1>DataExport</h1>
                </Container>
            </>
        );
    }
}

export default DataExport;