import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";
import BaseApiHandler from "../../network/baseApiHandler";

class FrontPage extends Component<any> {

    state = {
        test: ""
    }

    constructor(props:any) {
        super(props);
    }

    componentDidMount() {
        let apiHandler = new BaseApiHandler("test");
        apiHandler.get("/api", (value) => {
            this.setState({test: value});
        })
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Front</h1>
                    { this.state.test === "" ? "" : (<p>{this.state.test}</p>) }
                </Container>
            </>
        );
    }

}

export default FrontPage;