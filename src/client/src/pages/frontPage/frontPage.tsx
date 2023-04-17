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
        let bodyFail = {
            userId: [1,2,3],
            startDate: 1679266800000,
            endDate: 1682460000000,
            timeType: 1
        }

        apiHandler.post("/api/task/creation/post", {body: bodyFail}, (value) => {
            console.log(value)
        })
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