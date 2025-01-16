import {Route, Routes} from "react-router-dom";
import AdminDashBoard from "../Admin/Admin_Dashboard.jsx";
// import CRUD from "../Admin/CRUD.jsx";
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
import CourseOffer from "./CRUD/CourseOffer/CourseOffer.jsx";
import AddCourseOffer from "./CRUD/CourseOffer/AddCourseOffer.jsx";
import AddDistrict from "./CRUD/District/AddDistrict.jsx";
import Program from "./CRUD/Program/Program.jsx";
import AddProgram from "./CRUD/Program/AddProgram.jsx";
import ProgramOffer from "./CRUD/ProgramOffer/ProgramOffer.jsx";
import AddProgramOffer from "./CRUD/ProgramOffer/AddProgramOffer.jsx";
import Term from "./CRUD/Term/Term.jsx";
import AddTerm from "./CRUD/Term/AddTerm.jsx";
import Stream from "./CRUD/Stream/Stream.jsx";
import AddStream from "./CRUD/Stream/AddStream.jsx";
import AcademicSession from "./CRUD/AcademicSession/AcademicSession.jsx";
import CourseOfferFacultyMapping from "./CRUD/CourseOfferFacultyMapping/CourseOfferFacultyMapping.jsx";
import AddCourseOfferFacultyMapping from "./CRUD/CourseOfferFacultyMapping/AddCourseOfferFacultyMapping.jsx";
import AddAcademicSession from "./CRUD/AcademicSession/AddAcademicSession.jsx";
import StudentPersonalDetail from "./CRUD/StudentPersonalDetail/StudentPersonalDetail.jsx";
import AddStudentPersonalDetail from "./CRUD/StudentPersonalDetail/AddStudentPersonalDetail.jsx";
import ActivityMasterList from "./CRUD/ActivityMasterList/ActivityMasterList.jsx";
import AddActivityMasterList from "./CRUD/ActivityMasterList/AddActivityMasterList.jsx";
import Specialization from "./CRUD/Specialization/Specialization.jsx";
import Concentration from "./CRUD/Concentration/Concentration.jsx";
import Discipline from "./CRUD/Disciplines/Disciplines.jsx";
import Courses from "./CRUD/Courses/Courses.jsx";
import AddCourses from "./CRUD/Courses/AddCourses.jsx";
import AddDiscipline from "./CRUD/Disciplines/AddDisciplines.jsx";
import AddSpecialization from "./CRUD/Specialization/AddSpecialization.jsx";
import AddConcentration from "./CRUD/Concentration/AddConcentration.jsx";
import Registration from "./CRUD/Registration/Registration.jsx";
import AddRegistrationByStudent from "./CRUD/Registration/AddRegistrationByStudent.jsx";
import MasterSetting from "./MasterSetting.jsx";
import StudentRegistration from "./CRUD/StudentRegistration/StudentRegistration.jsx";
import AddStudentRegistration from "./CRUD/StudentRegistration/AddStudentRegistration.jsx";

import Batch from "./CRUD/Batch/Batch.jsx";
import AddBatch from "./CRUD/Batch/AddBatch.jsx";
import AddState from "./CRUD/State/AddState.jsx";
import AddRegistrationByCourse from "./CRUD/Registration/AddRegistrationByCourse.jsx";
import MasterReport from "./Report/MasterReport.jsx";
import StudentInformationReport from "./Report/StudentInformationReport.jsx";
import CoursesInformationReport from "./Report/CoursesInformationReport.jsx";
import GradesAcademicPerformanceReport from "./Report/GradesAcademicPerformanceReport.jsx";
import CQPIMeritReport from "./Report/CQPIMeritReport.jsx";
import BatchWiseProgramInformationReport from "./Report/BatchWiseProgramInformationReport.jsx";
import TranscriptsReport from "./Report/TranscriptsReport.jsx";
import CourseType from "./CRUD/CourseType/CourseType.jsx";
import AddCourseType from "./CRUD/CourseType/AddCourseType.jsx";
import Enrollment from "./CRUD/Registration/Enrollment.jsx";
import AttendancePage from "./CRUD/AttendanceSheet/AttendancePage.jsx";


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

                {/* <Route
                    path="crud"
                    element={
                        <ProtectedRoute>
                            <CRUD/>
                        </ProtectedRoute>
                    }
                /> */}

                <Route
                    path="crud"
                    element={
                        <ProtectedRoute>
                            <MasterSetting/>
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
                    path="crud/specialization"
                    element={
                        <Specialization/>
                    }
                />

                <Route
                    path="crud/specialization/add"
                    element={
                        <AddSpecialization/>
                    }
                />

                <Route
                    path="crud/concentration"
                    element={
                        <Concentration/>
                    }
                />

                <Route
                    path="crud/concentration/add"
                    element={
                        <AddConcentration/>
                    }
                />

                <Route
                    path="crud/discipline"
                    element={
                        <Discipline/>
                    }
                />

                <Route
                    path="crud/discipline/add"
                    element={
                        <AddDiscipline/>
                    }
                />

                <Route
                    path="crud/courses"
                    element={
                        <Courses/>
                    }
                />

                <Route
                    path="crud/courses/add"
                    element={
                        <AddCourses/>
                    }
                />

                <Route
                    path="crud/course-types"
                    element={
                        <CourseType/>
                    }
                />

                <Route
                    path="crud/course-types/add"
                    element={
                        <AddCourseType/>
                    }
                />

                <Route
                    path="crud/registration"
                    element={
                        <Registration/>
                    }
                />

                <Route
                    path="crud/student-registration"
                    element={
                        <StudentRegistration/>
                    }
                />

                <Route
                    path="crud/student-registration/add"
                    element={
                        <AddStudentRegistration/>
                    }
                />

                <Route
                    path="crud/enrollment/add-by-course"
                    element={
                        <AddRegistrationByCourse/>
                    }
                />

                <Route
                    path="crud/enrollment/add-by-student"
                    element={
                        <AddRegistrationByStudent/>
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

                {/* TODO: add the ProtectdeRoute */}
                <Route
                    path="crud/course-offer"
                    element={
                        // <ProtectedRoute>
                            <CourseOffer/>
                        // </ProtectedRoute>
                    }
                />

                {/* TODO: add the ProtectdeRoute */}
                <Route
                    path="crud/course-offer/add"
                    element={
                        <AddCourseOffer/>
                    }
                />

                {/* TODO: add the ProtectdeRoute */}
                <Route
                    path="crud/course-offer-faculty-mapping"
                    element={
                        <CourseOfferFacultyMapping/>
                    }
                />

                {/* TODO: add the ProtectdeRoute */}
                <Route
                    path="crud/course-offer-faculty-mapping/add"
                    element={
                        <AddCourseOfferFacultyMapping/>
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
                    path="crud/state/add"
                    element={
                        <ProtectedRoute>
                            <AddState/>
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
                    path="crud/district/add"
                    element={
                        <ProtectedRoute>
                            <AddDistrict/>
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
                    path="crud/program"
                    element={
                        <ProtectedRoute>
                            <Program/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/program/add"
                    element={
                        <ProtectedRoute>
                            <AddProgram/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/program-offer"
                    element={
                        <ProtectedRoute>
                            <ProgramOffer/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/program-offer/add"
                    element={
                        <ProtectedRoute>
                            <AddProgramOffer/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/term"
                    element={
                        <ProtectedRoute>
                            <Term/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/term/add"
                    element={
                        <ProtectedRoute>
                            <AddTerm/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/stream"
                    element={
                        <ProtectedRoute>
                            <Stream/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/stream/add"
                    element={
                        <ProtectedRoute>
                            <AddStream/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/academic-session"
                    element={
                        <ProtectedRoute>
                            <AcademicSession/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/academic-session/add"
                    element={
                        <ProtectedRoute>
                            <AddAcademicSession/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/student-personal-details"
                    element={
                        <ProtectedRoute>
                            <StudentPersonalDetail/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/student-personal-details/add"
                    element={
                        <ProtectedRoute>
                            <AddStudentPersonalDetail/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/activity-master-list"
                    element={
                        <ProtectedRoute>
                            <ActivityMasterList/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/activity-master-list/add"
                    element={
                        <ProtectedRoute>
                            <AddActivityMasterList/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/batch"
                    element={
                        <ProtectedRoute>
                            <Batch/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/batch/add"
                    element={
                        <ProtectedRoute>
                            <AddBatch/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="master-report"
                    element={
                        <ProtectedRoute>
                            <MasterReport/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/master-report/student-info"
                    element={
                        <ProtectedRoute>
                            <StudentInformationReport/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/master-report/courses-info"
                    element={
                        <ProtectedRoute>
                            <CoursesInformationReport/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/master-report/grades-academic-performance"
                    element={
                        <ProtectedRoute>
                            <GradesAcademicPerformanceReport/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/master-report/cqmi-merit"
                    element={
                        <ProtectedRoute>
                            <CQPIMeritReport/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/master-report/batch-wise-program-info"
                    element={
                        <ProtectedRoute>
                            <BatchWiseProgramInformationReport/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/master-report/transcripts"
                    element={
                        <ProtectedRoute>
                            <TranscriptsReport/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/enrollment"
                    element={
                        <ProtectedRoute>
                            <Enrollment/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="crud/attendance"
                    element={
                        <ProtectedRoute>
                            <AttendancePage/>
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