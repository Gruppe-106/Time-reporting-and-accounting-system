import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, Container} from "react-bootstrap";
import BaseApiHandler from "../../network/baseApiHandler";
import baseApiHandler from "../../network/baseApiHandler";

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
        const projectData = {
            projectId: 1,
            task: {
                name: "Redesign Website",
                userId: [1, 2, 3],
                startDate: 1683120000000, // May 1st, 2023 00:00:00 GMT
                endDate: 1687296000000,   // June 18th, 2023 00:00:00 GMT
                timeType: 1
            }
        }

        let apiHandler: baseApiHandler = new BaseApiHandler();
        apiHandler.post("/api/task/creation/post", {body: projectData}, (value) => {
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
                    <Button onClick={this.test}></Button>
                </Container>
            </>
        );
    }

}

export default FrontPage;