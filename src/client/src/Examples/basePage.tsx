import React, {Component} from "react";
import {Container} from "react-bootstrap";
import BaseNavBar from "../components/navBar";

interface BasePageProps {
    requiredProp: string;
    optionalProp?: number;
}

class BasePage extends Component<BasePageProps>{
    constructor(props:BasePageProps) {
        super(props);
    }

    private someFunction(text:string):JSX.Element {
        return (
            <h1>{text}</h1>
        );
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    {/* Page contains goes here */}
                    {this.someFunction("test") /* Will render the export of someFunction*/}
                </Container>
            </>
        );
    }
}

// Write: export default classname;
// ||
// \/
export {};