/*
    Editing of projects by its respective project leader
 */

import React, {Component} from "react";
import BaseNavBar from "../../components/navBar";
import {Container, Table} from "react-bootstrap";
import ProjectModel, {ProjectData} from "../../Models/projectModel";

class ProjectManager extends Component<any>{

    pData:ProjectData[] = [];
    state = {pLoaded: false};
    constructor(props:any) {
        super(props);
    }

    async GetProjectData():Promise<void> {
        let pModel:ProjectModel = new ProjectModel();
        pModel.GetAllModels().then(data => {
            this.pData = data
            this.setState({pLoaded: true});
        });
    }

    render() {
        if (!this.state.pLoaded)
        {
            this.GetProjectData();
        }
        return (
            <>
                <BaseNavBar/>
                <Container className={"py-5"}>
                    <h1>Project Manager</h1>
                    {
                        this.state.pLoaded? (
                            <Table striped bordered hover variant="dark">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Parent project</th>
                                    <th>Name</th>
                                    <th>Start date</th>
                                    <th>End date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.pData.map(p => (
                                    <tr>
                                        <td>{p.id}</td>
                                        <td>{p.superProject}</td>
                                        <td>{p.name}</td>
                                        <td>{p.startDate}</td>
                                        <td>{p.endDate}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        ):(<h4>Loading...</h4>)
                    }
                </Container>
            </>
        );
    }
}

export default ProjectManager;