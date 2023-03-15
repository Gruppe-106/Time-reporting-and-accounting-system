/*
    Show a list of projects a user is related to
 */

import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container} from "react-bootstrap";
import ProjectTable from "../projectViewer/components/projectTable";

class ProjectMenu extends Component<any>{

    constructor(props:any) {
        super(props);
    }


    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Project Menu</h1>
                    {
                    <ProjectTable tableRows={[{id:1, superProject:-1, name:"P1",startDate:Date.now(), endDate:Date.now()}
                    , {id:2, superProject:1, name:"P2",startDate:Date.now(), endDate:Date.now()}]}/>
                    }
                </Container>

            </>
        );
    }
}

export default ProjectMenu;