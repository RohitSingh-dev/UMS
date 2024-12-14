import UserDetailsCard from "../AllUser/UserDetailsCard";
import UserDetailsCardContent from "../AllUser/UserDetailsCardContent";
import WarningAlert from "../AllUser/WarningAlert";
import {Alert_Error, JWT_COOKIES_NAME} from "../Util/AppConstant";
import StudentLayout from "./StudentLayout";
import userPic from "../../assets/UserDocument/Images/avatar.jpg";
import userSign from "../../assets/UserDocument/Images/image.png";
import DashboardDetailsCard from "./DashboardDetailsCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleDown, faFileAlt, faPenFancy,} from "@fortawesome/free-solid-svg-icons";
import ActionButton from "../AllUser/ActionButton.jsx";
import axios from "axios";
import CookieHelper from "../../services/UseCookies.jsx";

function StudentDashboard() {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);

    const downloadReport = async () => {
        try {
            const response = await axios.get('generateQuestionPaper/generate-report', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', // This should be in the same configuration object
            });

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a link element
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'question_paper_report.pdf'); // Specify the file name

            // Append to the body
            document.body.appendChild(link);

            // Trigger download
            link.click();

            // Clean up
            window.URL.revokeObjectURL(url); // Revoke the blob URL to free up memory
            link.remove();
        } catch (error) {
            console.error('Error downloading the report', error);
        }
    };


    return (
        <StudentLayout>
            <WarningAlert
                alertType={Alert_Error}
                header="FORM FILLUP"
                details="or Odd semester 2021-2022 (Unfortunate
        Time Over)"
            ></WarningAlert>
            <div className="row">
                <UserDetailsCard
                    profilePhoto={userPic}
                    sign={userSign}
                    userName="BRISTI MONDAL"
                >
                    <UserDetailsCardContent header="BENGALI HONS" value="0"/>
                    <a
                        className="btn btn-rounded btn-outline-light  font-14 py-1 mr-2 mt-3"
                        href="profile-edit.html"
                    >
                        Edit
                    </a>
                    <a
                        className="btn btn-rounded badge-success font-14 py-1 ms-2 mt-3"
                        href="form-fillup.html"
                    >
                        Form Fillup
                    </a>
                </UserDetailsCard>
                <DashboardDetailsCard
                    onEyeBtnClick={() => {
                        console.log("clicked");
                    }}
                    icon={<FontAwesomeIcon icon={faPenFancy}/>}
                    cardHeaderText="LATEST EXAMINATION"
                    cardTitleText="Evolution of Geography Thought"
                    cardSubTitleText="Code:51911"
                    downloadBtnText="Download Paper"
                    onClickDownloadBtn={() => {
                        console.log("download");
                    }}
                    cardFooterText="Exam Date on 20/10/2021"
                />
                <DashboardDetailsCard
                    onEyeBtnClick={() => {
                        console.log("clicked");
                    }}
                    icon={<FontAwesomeIcon icon={faFileAlt}/>}
                    cardHeaderText="GRADE REPORT"
                    cardTitleText="Semester III, 2020-21"
                    cardSubTitleText="Total:201"
                    downloadBtnText="Download Marksheet"
                    onClickDownloadBtn={() => {
                        console.log("download");
                    }}
                    cardFooterText="Remarks: SQ(Semester Qualified"
                />
            </div>
            <div className="row">
                <div className="col-12 my-4">
                    <h4 className="text-uppercase font-24">Download</h4>
                    <ActionButton
                        icon={<FontAwesomeIcon icon={faArrowAltCircleDown}/>}
                        btnName="Download"
                        onClick={() => downloadReport()}
                    />
                </div>
            </div>
        </StudentLayout>
    );
}

export default StudentDashboard;
