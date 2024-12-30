import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "../../Util/ProtectedRoute.jsx";
import TeacherDashBoard from "./Teacher_Dashboard";
import OnlineMarksSubmission from "../QuestionPaperEvaluation/OnlineMarksSubmission.jsx";
import AnswerScriptTeacherMapping from "../QuestionPaperEvaluation/AnswerScriptTeacherMapping";
import Settings from "../AllUser/Settings/Settings.jsx";
import PopUpAnnotation from "../QuestionPaperEvaluation/PaperEvaluationWindow/PopUpAnnoation.jsx";
import PopUpApprovalWindow from "../QuestionPaperEvaluation/PaperApprovalWindow/PopUpApprovalWindow.jsx";
import CompareAnswerScript from "../QuestionPaperEvaluation/PaperApprovalWindow/CompareAnswerScript";
import MakeQuestionPaper from "../QuestionPaperEvaluation/MakeQuestionPaper.jsx";
import MarksEntryOverallView from "../QuestionPaperEvaluation/PaperEvaluationWindow/MarksEntryOverallView";
import StudentAnswerUpload from "../QuestionPaperEvaluation/StudentAnswerUpload.jsx";
import QuestionBankCreation from "../QuestionPaperCreation/QuestionBankCreation";
import QuestionPaperCreation from "../QuestionPaperCreation/QuestionPaperCreation";
import AIQuestionBankCreation
    from "../QuestionPaperCreation/AIQuestionBankCreation/AIQuestionBankCreation.jsx";
import {ROLE_TEACHER} from "../../Util/AppConstant.jsx";

const TeacherRoutes = () => {
    return (
            <Routes>
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <TeacherDashBoard/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="submitMarks"
                    element={
                        <ProtectedRoute>
                            <OnlineMarksSubmission/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="answer-script-mapping"
                    element={
                        <ProtectedRoute>
                            <AnswerScriptTeacherMapping/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="settings"
                    element={
                        <ProtectedRoute>
                            <Settings role={ROLE_TEACHER}/>
                        </ProtectedRoute>
                    }
                />

                {/**ROUTES FOR ONLINE EVALUATION**/}
                <Route
                    path="popupexamination"
                    element={
                        <ProtectedRoute>
                            <PopUpAnnotation/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="approvalpopup"
                    element={
                        <ProtectedRoute>
                            <PopUpApprovalWindow/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="answer-script-compair"
                    element={
                        <ProtectedRoute>
                            <CompareAnswerScript/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="marksehet"
                    element={
                        <ProtectedRoute>
                            <MakeQuestionPaper/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="given-marks"
                    element={
                        <ProtectedRoute>
                            <MarksEntryOverallView/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="upload-student-answer"
                    element={
                        <ProtectedRoute>
                            <StudentAnswerUpload/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="asnwer-script-teacher-mapping"
                    element={
                        <ProtectedRoute>
                            <AnswerScriptTeacherMapping/>
                        </ProtectedRoute>
                    }
                />

                {/**ROUTES FOR QUESTION BANK CREATION*/}
                <Route
                    path="question-bank"
                    element={
                        <ProtectedRoute>
                            <QuestionBankCreation/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="question-paper-creation"
                    element={
                        <ProtectedRoute>
                            <QuestionPaperCreation/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="ai-question-creation"
                    element={
                        <ProtectedRoute>
                            <AIQuestionBankCreation/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
    );
}

export default TeacherRoutes;