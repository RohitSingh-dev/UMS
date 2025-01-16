import "./App.css";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./Util/ProtectedRoute.jsx";
import CookieHelper from "./services/UseCookies.jsx";
import axios from "axios";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'
import Settings from "./components/AllUser/Settings/Settings.jsx";
import LoginPage from "./components/AllUser/LoginPage/LoginPage.jsx";
import Report from "./components/AllUser/Report/Report.jsx";
import EvaluationOverAllReport from "./components/AllUser/Report/Evaluation/EvaluationOverAllReport.jsx";
import {setupInterceptors} from "./Axios/axiosInstance.jsx";
import {useEffect} from "react";
import {useLoading} from "./hooks/useLoading.jsx";
import AdminRoutes from "./components/Admin/AdminRoutes.jsx";
import StudentRoutes from "./components/Student/StudentRoutes.jsx";
import TeacherRoutes from "./components/Teacher/TeacherRoutes.jsx";
import BOSRoutes from "./components/BOS/BOSRoutes.jsx";
import {ROLE_ADMIN, ROLE_COOKIES_NAME} from "./Util/AppConstant.jsx";
import GrievanceList from "./components/AllUser/Grievance/GrievanceList.jsx";
import GrievanceDetail from "./components/AllUser/Grievance/GrievanceDetail.jsx";

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
                {/* Admin Routes */}
                <Route path="/admin/*" element={<AdminRoutes />} />

                {/* Student Routes */}
                <Route path="/student/*" element={<StudentRoutes />} />

                {/* Teacher Routes */}
                <Route path="/teacher/*" element={<TeacherRoutes />} />

                {/* BOS Routes */}
                <Route path="/bos/*" element={<BOSRoutes />} />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings role={ROLE_ADMIN}/>
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

                {/* FIXME: add in the protected route */}
                <Route
                    path="/grievance"
                    element={
                        <GrievanceList/>
                    }
                />

                <Route
                    path="/grievance/details"
                    element={
                        <GrievanceDetail/>
                    }
                />

                <Route element={<LoginPage/>} path="/"/>
            </Routes>
    );
}

export default App;
library.add(fab, far, fas)
