
import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Button, Col, Container} from "react-bootstrap";
import {ProjectTableRow} from "../projectViewer/components/projectTable";
import Row from "react-bootstrap/Row";
import CreateTaskTable from "./components/projectCreateTasksTest";

interface  ProjectMenuState{
    projects: ProjectTableRow[];
}

const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id") as string);

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
                    <Row>
                        <CreateTaskTable initialRows={[]}></CreateTaskTable>
                    </Row>
                </Container>

            </>
        );
    }
}

export default TaskCreator;