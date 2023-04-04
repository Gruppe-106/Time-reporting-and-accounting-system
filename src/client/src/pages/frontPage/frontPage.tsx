import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, Container} from "react-bootstrap";
import BaseApiHandler from "../../network/baseApiHandler";
import baseApiHandler from "../../network/baseApiHandler";
import {userInfo} from "../../utility/router";

class FrontPage extends Component<any> {

    state = {
        test: ""
    }

    constructor(props:any) {
        super(props);
    }

    componentDidMount() {
        let apiHandler = new BaseApiHandler();
        apiHandler.get("/api", {},(value) => {
            if (typeof value === "string") {
                let json:{message: string} = JSON.parse(value)
                this.setState({test: json.message});
            }
        })
    }

    private test() {
        let apiHandler: baseApiHandler = new BaseApiHandler();
        apiHandler.get("/api/task/user/get?id=1", {}, (value) => {
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
                    { userInfo.isAdmin ? (<Button onClick={this.test}></Button>) : null }
                </Container>
            </>
        );
    }

}

export default FrontPage;