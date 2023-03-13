import { BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";

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

function Router() {
    return (
        <>
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
                    <Route path={"/Login"} Component={Login}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Router;
