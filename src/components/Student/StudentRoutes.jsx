import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "../../Util/ProtectedRoute.jsx";
import StudentDashboard from "../Student/StudentDashboard";

const StudentRoutes = () => {
    return (
            <Routes>
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <StudentDashboard/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
    );
}

export default StudentRoutes;