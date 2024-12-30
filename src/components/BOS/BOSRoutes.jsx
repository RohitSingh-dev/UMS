import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "../../Util/ProtectedRoute.jsx";
import BOSDashBoard from "./BOS_Dashboard.jsx";
import QuestionBankConfigurationCreation from "../QuestionPaperCreation/QuestionBankConfigurationCreation.jsx";
import PaperSetterConfiguration from "../QuestionPaperCreation/PaperSetterConfiguration.jsx";
import Settings from "../AllUser/Settings/Settings.jsx";

import {ROLE_BOS} from "../../Util/AppConstant.jsx";

const BOSRoutes = () => {
    return (
            <Routes>
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <BOSDashBoard/>
                        </ProtectedRoute>
                    }
                />

                {/*//TODO: This route for ROLE_BOS*/}
                <Route
                    path="question-paper-configuration"
                    element={
                        <ProtectedRoute>
                            <QuestionBankConfigurationCreation/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="paper-setter-configuration"
                    element={
                        <ProtectedRoute>
                            <PaperSetterConfiguration/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="settings"
                    element={
                        <ProtectedRoute>
                            <Settings role={ROLE_BOS}/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
    );
}

export default BOSRoutes;