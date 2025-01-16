import AdminLayout from "./AdminLayout.jsx";
import LinkButton from "../AllUser/LinkButton.jsx";
import {useTranslation} from "react-i18next";

const MasterSetting = () => {
    const { t } = useTranslation();

    const breadcrumbData = [
        {name: t("masterSettings.breadcrumb.dashboard"), url: '/admin/dashboard'},
        {name: t("masterSettings.header")}
    ];

    return (
        <AdminLayout breadcrumbItems={breadcrumbData}>
            <div className='row'>
                <LinkButton url='program' name={t("masterSettings.modules.program")}/>
                <LinkButton url='program-offer' name={t("masterSettings.modules.programOffer")}/>
                <LinkButton url='term' name={t("masterSettings.modules.term")}/>
                <LinkButton url='academic-session' name={t("masterSettings.modules.academicSession")}/>
                <LinkButton url='stream' name={t("masterSettings.modules.stream")}/>
                <LinkButton url='student-registration' name="New Student Registration"/>
                <LinkButton url='enrollment' name="Enrollment"/>
                <LinkButton url='specialization' name={t("masterSettings.modules.specialization")}/>
                <LinkButton url='concentration' name={t("masterSettings.modules.concentration")}/>
                <LinkButton url='courses' name={t("masterSettings.modules.courses")}/>
                <LinkButton url='course-types' name={t("masterSettings.modules.courseType")}/>
                {/* <LinkButton url='discipline' name={t("discipline.header")}/> */}
                <LinkButton url='course-offer' name={t("masterSettings.modules.courseOffer")}/>
                <LinkButton url='course-offer-faculty-mapping' name={t("masterSettings.modules.courseOfferFacultyMapping")}/>
                {/*TODO: ATTENDANCE SHEET WILL BE REMOVED FROM CRUD*/}
                <LinkButton url='attendance' name='Attendance Page'/>
            </div>
        </AdminLayout>
    )
}

export default MasterSetting;