import {Route, Routes} from "react-router-dom";
import AdminDashBoard from "../Admin/Admin_Dashboard.jsx";
import CRUD from "../Admin/CRUD.jsx";
import QuestionType from "../Admin/CRUD/QuestionType/QuestionType.jsx";
import AddQuestionType from "../Admin/CRUD/QuestionType/AddQuestionType.jsx";
import User from "../Admin/CRUD/User/User.jsx";
import AddUser from "../Admin/CRUD/User/AddUser.jsx";
import Menu from "../Admin/CRUD/Menu/Menu.jsx";
import AddMenu from "../Admin/CRUD/Menu/AddMenu.jsx";
import RoleMenuMapping from "../Admin/CRUD/RoleMenuMapping/RoleMenuMapping.jsx";
import ActionButton from "../Admin/CRUD/ActionButton/ActionButton.jsx";
import AddActionButton from "../Admin/CRUD/ActionButton/AddActionButton.jsx";
import ProtectedRoute from "../../Util/ProtectedRoute.jsx";
import AddRole from "./CRUD/RoleMenuMapping/AddRole.jsx";
import Religion from "./CRUD/Religion/Religion.jsx";
import SingleEnroll from "./CRUD/Enroll/SingleEnroll.jsx";
import GrivenceList from "../AllUser/Grievance/GrievanceList.jsx";
import ManageMenu from "./Menu/ManageMenu.jsx";
import DocumentType from "./CRUD/DocumentType/DocumentType.jsx";
import AddReligion from "./CRUD/Religion/AddReligion.jsx";
import AddDocumentType from "./CRUD/DocumentType/AddDocumentType.jsx";
import SocialCategory from "./CRUD/SocialCategory/SocialCategory.jsx";
import AddSocialCategory from "./CRUD/SocialCategory/AddSocialCategory.jsx";
import State from "./CRUD/State/State.jsx";
import AwardType from "./CRUD/AwardType/AwardType.jsx";
import District from "./CRUD/District/District.jsx";
import AddAwardType from "./CRUD/AwardType/AddAwardType.jsx";

const AdminRoutes = () => {
    return (
            <Routes>
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashBoard/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud"
                    element={
                        <ProtectedRoute>
                            <CRUD/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/question-types"
                    element={
                        <ProtectedRoute>
                            <QuestionType/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/question-types/add"
                    element={
                        <ProtectedRoute>
                            <AddQuestionType/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/user"
                    element={
                        <ProtectedRoute>
                            <User/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/user/add"
                    element={
                        <ProtectedRoute>
                            <AddUser/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/menu"
                    element={
                        <ProtectedRoute>
                            <Menu/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/menu/add"
                    element={
                        <ProtectedRoute>
                            <AddMenu/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/action-button"
                    element={
                        <ProtectedRoute>
                            <ActionButton/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/action-button/add"
                    element={
                        <ProtectedRoute>
                            <AddActionButton/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/role-menu-mapping"
                    element={
                        <ProtectedRoute>
                            <RoleMenuMapping/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/grivence"
                    element={
                        <GrivenceList/>
                    }
                />

                <Route
                    path="crud/role-menu-mapping/add"
                    element={
                        <ProtectedRoute>
                            <AddRole/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/manage-menu"
                    element={
                        <ProtectedRoute>
                            <ManageMenu/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/document-type"
                    element={
                        <ProtectedRoute>
                            <DocumentType/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/document-type/add"
                    element={
                        <ProtectedRoute>
                            <AddDocumentType/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/religion"
                    element={
                        <ProtectedRoute>
                            <Religion/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/religion/add"
                    element={
                        <ProtectedRoute>
                            <AddReligion/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/social-category"
                    element={
                        <ProtectedRoute>
                            <SocialCategory/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/social-category/add"
                    element={
                        <ProtectedRoute>
                            <AddSocialCategory/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/state"
                    element={
                        <ProtectedRoute>
                            <State/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/district"
                    element={
                        <ProtectedRoute>
                            <District/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/award-type"
                    element={
                        <ProtectedRoute>
                            <AwardType/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/award-type/add"
                    element={
                        <ProtectedRoute>
                            <AddAwardType/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/enroll"
                    element={
                        <SingleEnroll/>
                    }
                />
            </Routes>
    );
}

export default AdminRoutes;