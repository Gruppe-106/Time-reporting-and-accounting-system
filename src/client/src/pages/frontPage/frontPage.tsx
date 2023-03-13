import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";

class FrontPage extends Component<any>{
    constructor(props:any) {
        super(props);
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Front</h1>
                </Container>
            </>
        );
    }

}

export default FrontPage;