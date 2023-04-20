import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, Container} from "react-bootstrap";
import {ProjectTableRow} from "../projectViewer/components/projectTable";
import CreateTaskTable from "./components/projectEditTasks";

interface  ProjectMenuState{
    projects: ProjectTableRow[];
}

class TaskCreator extends Component<any, ProjectMenuState>{

    constructor(props:any) {
        super(props);

        this.state ={
            projects: []
        };
    }

    render() {
        return (
            <>
                <BaseNavBar/>
                <Container>
                    <h1>Task Editor</h1>
                    <Button href="/project/menu" variant="outline-secondary">Back</Button>{''}
                </Container>

                <Container>
                        <CreateTaskTable initialRows={[]}></CreateTaskTable>
                </Container>

            </>
        );
    }
}

export default TaskCreator;