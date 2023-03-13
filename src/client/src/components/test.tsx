import React from "react";
import {Button} from "react-bootstrap";

interface testProp {
    name:string;
    test?:number;
}
class Test extends React.Component<testProp> {
    state = {
        nameTest: ""
    }
    constructor(props:testProp) {
        super(props);
        this.state.nameTest = props.name;
    }

    render():JSX.Element {
        return (
            <>
                <h1>{ this.state.nameTest }</h1>
                <Button variant={this.state.nameTest} onClick={() => {this.setState({nameTest: "test"})}}>test</Button>
            </>
        )
    }
}

export default Test;