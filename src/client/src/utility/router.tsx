import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
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
import UserTimeRegister from "../pages/timeRegister/userTimeRegister";
import AdminTimeRegister from "../pages/timeRegister/adminTimeRegister";
import BaseApiHandler from "../network/baseApiHandler";
import {Col, Row} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import TaskCreator from "../pages/projectCreation/taskCreator";
import TimeRegister from "../pages/timeRegister2/timeRegister";

interface AuthApi {
    status: number,
    data: {
        success: boolean,
        userId?: number,
        userRoles?: {
            roleId: number
        }[]
    }
}

const userInfo = {
    userId: -1,
    isAdmin: false,
    isProjectLeader: false,
    isManager: false
}

export {userInfo};

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
            let apiHandler:BaseApiHandler = new BaseApiHandler();
            apiHandler.get("/api/auth", {}, (value) => {
                let response: AuthApi = JSON.parse(JSON.stringify(value));
                if (response.data.success && response.data.userId && response.data.userRoles) {
                    userInfo.userId   = response.data.userId;

                    for (const userRole of response.data.userRoles) {
                        if (userRole.roleId === 4)                          userInfo.isAdmin         = true;
                        if (userRole.roleId === 3 || userRole.roleId === 4) userInfo.isProjectLeader = true;
                        if (userRole.roleId === 2 || userRole.roleId === 4) userInfo.isManager       = true;
                        if (userInfo.isAdmin) break;
                    }

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
                                { userInfo.isAdmin ? <Route path={"/admin/edit-user"} Component={AdminPanel}/> : ""}
                                { userInfo.isAdmin ? <Route path={"/admin/create-user"} Component={UserCreation}/> : ""}
                                { userInfo.isAdmin ?  <Route path={"/data-export"} Component={DataExport}/> : ""}
                                { userInfo.isProjectLeader ?  <Route path={"/project/create"} Component={ProjectCreator}/> : ""}
                                { userInfo.isProjectLeader ? <Route path={"/project/manage"} Component={ProjectManager}/> : ""}
                                { userInfo.isProjectLeader ? <Route path={"/project/create/task"} Component={TaskCreator}/> : ""}
                                <Route path={"/project/menu"} Component={ProjectMenu}/>
                                <Route path={"/project/viewer"} Component={ProjectViewer}/>
                                { userInfo.isManager && !userInfo.isAdmin ?  <Route path={"/group/time-approval"} Component={GroupManager}/> : ""}
                                <Route path={"/user-register"} Component={TimeRegister}/>
                                { userInfo.isAdmin ? <Route path={"/user-register/admin"} Component={AdminTimeRegister}/> : ""}
                                <Route path="*" element={<Navigate to="/" replace />} />
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
