import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, Container} from "react-bootstrap";
import BaseApiHandler from "../../network/baseApiHandler";
import baseApiHandler from "../../network/baseApiHandler";

class FrontPage extends Component<any> {

    state = {
        test: ""
    }

    private test() {
        let apiHandler: baseApiHandler = new BaseApiHandler();
        let bodySuccess = {
            name: "test",
            startDate: 1735689600000, //2025-01-01
            endDate: 1764547200000,   //2025-12-01
            projectLeader: [2]
        }
        apiHandler.post("/api/project/creation/post", {body: bodySuccess}, (value) => {
            console.log(value)
        });
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Front</h1>
                    { this.state.test === "" ? "" : (<p>{this.state.test}</p>) }
                    <Button disabled={false} onClick={this.test}></Button>
                </Container>
            </>
        );
    }

}

export default FrontPage;