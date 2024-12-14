import "./App.css";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/Util/ProtectedRoute";
import {ROLE_ADMIN, ROLE_BOS, ROLE_COOKIES_NAME, ROLE_TEACHER,} from "./components/Util/AppConstant";
import CookieHelper from "./services/UseCookies.jsx";
import AdminDashBoard from "./components/Admin/Admin_Dashboard";
import axios from "axios";
import StudentDashboard from "./components/Student/StudentDashboard";
import MakeQuestionPaper from "./components/QuestionPaperEvaluation/MakeQuestionPaper.jsx";
import MarksEntryOverallView
    from "./components/QuestionPaperEvaluation/PaperEvaluationWindow/MarksEntryOverallView.jsx";
import PopUpAnnotation from "./components/QuestionPaperEvaluation/PaperEvaluationWindow/PopUpAnnoation.jsx";
import OnlineMarksSubmission from "./components/QuestionPaperEvaluation/OnlineMarksSubmission.jsx";
import TeacherDashBoard from "./components/Teacher/Teacher_Dashboard.jsx";
import QuestionBankCreation from "./components/QuestionPaperCreation/QuestionBankCreation.jsx";
import QuestionPaperCreation from "./components/QuestionPaperCreation/QuestionPaperCreation.jsx";
import QuestionBankConfigurationCreation
    from "./components/QuestionPaperCreation/QuestionBankConfigurationCreation.jsx";
import CRUD from "./components/Admin/CRUD.jsx";
import QuestionType from "./components/Admin/CRUD/QuestionType/QuestionType.jsx";
import AddQuestionType from "./components/Admin/CRUD/QuestionType/AddQuestionType.jsx";
import BOSDashBoard from "./components/BOS/BOS_Dashboard.jsx";
import PaperSetterConfiguration from "./components/QuestionPaperCreation/PaperSetterConfiguration.jsx";
import User from "./components/Admin/CRUD/User/User.jsx";
import AddUser from "./components/Admin/CRUD/User/AddUser.jsx";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'
import Menu from "./components/Admin/CRUD/Menu/Menu.jsx";
import AddMenu from "./components/Admin/CRUD/Menu/AddMenu.jsx";
import RoleMenuMapping from "./components/Admin/CRUD/RoleMenuMapping/RoleMenuMapping.jsx";
import Settings from "./components/AllUser/Settings/Settings.jsx";
import StudentAnswerUpload from "./components/QuestionPaperEvaluation/StudentAnswerUpload.jsx";
import AnswerScriptTeacherMapping from "./components/QuestionPaperEvaluation/AnswerScriptTeacherMapping.jsx";
import LoginPage from "./components/AllUser/LoginPage/LoginPage.jsx";
import ActionButton from "./components/Admin/CRUD/ActionButton/ActionButton.jsx";
import AddActionButton from "./components/Admin/CRUD/ActionButton/AddActionButton.jsx";
import AIQuestionBankCreation
    from "./components/QuestionPaperCreation/AIQuestionBankCreation/AIQuestionBankCreation.jsx";
import PopUpApprovalWindow from "./components/QuestionPaperEvaluation/PaperApprovalWindow/PopUpApprovalWindow.jsx";
import CompareAnswerScript from "./components/QuestionPaperEvaluation/PaperApprovalWindow/CompareAnswerScript.jsx";
import Report from "./components/AllUser/Report/Report.jsx";
import EvaluationOverAllReport from "./components/AllUser/Report/Evaluation/EvaluationOverAllReport.jsx";
import {setupInterceptors} from "./Axios/axiosInstance.jsx";
import {useEffect} from "react";
import {useLoading} from "./hooks/useLoading.jsx";

function App() {
    axios.defaults.baseURL = import.meta.env.VITE_BASE_URl;
    let userRole = CookieHelper.getCookie(ROLE_COOKIES_NAME);
    if (userRole === undefined) {
        userRole = "";
    }

    const {showLoading, hideLoading} = useLoading(); // Access global loading state

    // Set up interceptors for axios instance to use global loading state
    useEffect(() => {
        setupInterceptors(showLoading, hideLoading);

    }, [showLoading, hideLoading]);


    return (
            <Routes>
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute>
                            <StudentDashboard/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teacher/dashboard"
                    element={
                        <ProtectedRoute>
                            <TeacherDashBoard/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bos/dashboard"
                    element={
                        <ProtectedRoute>
                            <BOSDashBoard/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teacher/submitMarks"
                    element={
                        <ProtectedRoute>
                            <OnlineMarksSubmission/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teacher/answer-script-mapping"
                    element={
                        <ProtectedRoute>
                            <AnswerScriptTeacherMapping/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teacher/settings"
                    element={
                        <ProtectedRoute>
                            <Settings role={ROLE_TEACHER}/>
                        </ProtectedRoute>
                    }
                />
                {/**ROUTES FOR ONLINE EVALUATION**/}
                <Route
                    path="/teacher/popupexamination"
                    element={
                        <ProtectedRoute>
                            <PopUpAnnotation/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/approvalpopup"
                    element={
                        <ProtectedRoute>
                            <PopUpApprovalWindow/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/answer-script-compair"
                    element={
                        <ProtectedRoute>
                            <CompareAnswerScript/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/marksehet"
                    element={
                        <ProtectedRoute>
                            <MakeQuestionPaper/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/given-marks"
                    element={
                        <ProtectedRoute>
                            <MarksEntryOverallView/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/upload-student-answer"
                    element={
                        <ProtectedRoute>
                            <StudentAnswerUpload/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/asnwer-script-teacher-mapping"
                    element={
                        <ProtectedRoute>
                            <AnswerScriptTeacherMapping/>
                        </ProtectedRoute>
                    }
                />
                {/**ROUTES FOR QUESTION BANK CREATION*/}
                <Route
                    path="/teacher/question-bank"
                    element={
                        <ProtectedRoute>
                            <QuestionBankCreation/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/question-paper-creation"
                    element={
                        <ProtectedRoute>
                            <QuestionPaperCreation/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teacher/ai-question-creation"
                    element={
                        <ProtectedRoute>
                            <AIQuestionBankCreation/>
                        </ProtectedRoute>
                    }
                />

                {/*//TODO: This route for ROLE_BOS*/}
                <Route
                    path="/bos/question-paper-configuration"
                    element={
                        <ProtectedRoute>
                            <QuestionBankConfigurationCreation/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bos/paper-setter-configuration"
                    element={
                        <ProtectedRoute>
                            <PaperSetterConfiguration/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bos/settings"
                    element={
                        <ProtectedRoute>
                            <Settings role={ROLE_BOS}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashBoard/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings role={ROLE_ADMIN}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/crud"
                    element={
                        <ProtectedRoute>
                            <CRUD/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/crud/question-types"
                    element={
                        <ProtectedRoute>
                            <QuestionType/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/crud/question-types/add"
                    element={
                        <ProtectedRoute>
                            <AddQuestionType/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/crud/user"
                    element={
                        <ProtectedRoute>
                            <User/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/crud/user/add"
                    element={
                        <ProtectedRoute>
                            <AddUser/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/crud/menu"
                    element={
                        <ProtectedRoute>
                            <Menu/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/crud/menu/add"
                    element={
                        <ProtectedRoute>
                            <AddMenu/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/crud/action-button"
                    element={
                        <ProtectedRoute>
                            <ActionButton/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/crud/action-button/add"
                    element={
                        <ProtectedRoute>
                            <AddActionButton/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/crud/role-menu-mapping"
                    element={
                        <ProtectedRoute>
                            <RoleMenuMapping/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/report"
                    element={
                        <ProtectedRoute>
                            <Report/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/report/evaluation"
                    element={
                        <ProtectedRoute>
                            <EvaluationOverAllReport/>
                        </ProtectedRoute>
                    }
                />

                <Route element={<LoginPage/>} path="/"/>
            </Routes>
    );
}

export default App;
library.add(fab, far, fas)
