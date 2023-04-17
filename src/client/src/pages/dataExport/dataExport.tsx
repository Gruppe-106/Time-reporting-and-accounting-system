/*
    Button that exports file in the given month
    *Maybe filters if time allows*
 */

import React, {Component} from "react";
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
                        apiHandler.get("/api/task/project/get?task=3", {}, (value) => {
                            console.log(value)
                        });
                    }
                    }></Button>
                    <h1>DataExport</h1>
                </Container>
            </>
        );
    }
}

export default DataExport;