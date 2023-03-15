import React, {Component} from "react";
import BaseApiHandler from "../network/baseApiHandler";

class Example extends Component<any> {

    state = {
        test: ""
    }

    constructor(props:any) {
        super(props);
    }

    /**
     * Important bit
     * componentDidMount runs ones the component is rendered the first time
     */
    componentDidMount() {
        //First make an instance of the api handler, give it the auth key of the user once implemented
        let apiHandler = new BaseApiHandler("test");
        //Run the get or post function depending on need only neccesarry argument is the path aka what comes after the hostname
        //Callbacks can be used to tell what to do with the data once it's been retrieved
        apiHandler.get("/api", (value) => {
            //First check if the value gotten is a string
            if (typeof value === "string") {
                //Then convert the string to the expected object(eg. )
                let json:{message: string} = JSON.parse(value)
                //Then update states or variables or whatever you want with the information
                this.setState({test: json.message});
            }
        })
    }

    render() {
        return (
            <></>
        );
    }

}