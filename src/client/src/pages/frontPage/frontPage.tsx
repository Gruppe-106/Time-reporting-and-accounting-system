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
        apiHandler.get("/api/project/info/get?ids=1,2", {}, (value) => {
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