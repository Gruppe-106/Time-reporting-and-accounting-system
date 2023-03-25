import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, {Component} from "react";
import Cookies from "js-cookie";

//Components to route to:
import AdminPanel from "../pages/adminPanel/adminPanel";
import FrontPage from "../pages/frontPage/frontPage";
import UserCreation from "../pages/adminPanel/userCreation";
import DataExport from "../pages/dataExport/dataExport";
import Login from "../pages/login/login";
import ProjectCreator from "../pages/projectCreation/projectCreator";
import ProjectManager from "../pages/projectCreation/projectManager";
import ProjectMenu from "../pages/projectViewer/projectMenu";
import ProjectViewer from "../pages/projectViewer/projectViewer";
import GroupManager from "../pages/timeApproval/groupManager";
import UserTimeApproval from "../pages/timeApproval/userTimeApproval";
import UserTimeRegister from "../pages/timeRegister/userTimeRegister";
import BaseApiHandler from "../network/baseApiHandler";
import {Col, Row} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

interface AuthApi {
    status: number,
    data: {
        success: boolean,
        userId?: number
    }
}

class Router extends Component<any> {
    state = {
        requireLogin: false,
        authenticated: false
    }

    componentDidMount() {
        let authCookie = Cookies.get("auth");
        if (authCookie === undefined) {
            this.setState({ requireLogin: true });
        } else {
            let apiHandler:BaseApiHandler = new BaseApiHandler("test");
            apiHandler.get("/api/auth", {}, (value) => {
                let response: AuthApi = JSON.parse(JSON.stringify(value));
                if (response.data.success && response.data.userId) {
                    this.setState({ authenticated: true });
                } else {
                    Cookies.remove("auth");
                    this.setState({ requireLogin: true });
                }
            });
        }
    }

    render() {
        return (<>{
        (       this.state.requireLogin ? (<Login/>) :
                this.state.authenticated ?
                    (
                        <BrowserRouter>
                            <Routes>
                                <Route path={"/"} Component={FrontPage}/>
                                <Route path={"/admin"} Component={AdminPanel} />
                                <Route path={"/admin/create-user"} Component={UserCreation}/>
                                <Route path={"/data-export"} Component={DataExport}/>
                                <Route path={"/project/create"} Component={ProjectCreator}/>
                                <Route path={"/project/manage"} Component={ProjectManager}/>
                                <Route path={"/project/menu"} Component={ProjectMenu}/>
                                <Route path={"/project/viewer"} Component={ProjectViewer}/>
                                <Route path={"/group/manager"} Component={GroupManager}/>
                                <Route path={"/group/time-approval"} Component={UserTimeApproval}/>
                                <Route path={"/user-register"} Component={UserTimeRegister}/>
                            </Routes>
                        </BrowserRouter>
                    ) : (
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Row style={{ height: "100vh" }} className="align-items-center">
                                <Col md="auto" xs="auto"><Spinner animation="grow"/></Col>
                                <Col md="auto" xs="auto"><Spinner animation="grow"/></Col>
                                <Col md="auto" xs="auto"><Spinner animation="grow"/></Col>
                            </Row>
                        </div>
                    )
        )
        }</>);
    }
}

export default Router;
