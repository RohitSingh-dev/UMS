import CRUDPage from "../CRUDPage.jsx";
import { useTranslation } from "react-i18next";

const CourseOffer = () => {
    const { t } = useTranslation();

    // API Endpoints
    const apiEndpoints = {
        fetch: "/search/course-offers",
        delete: "/crud/course-offer/delete"
    };

    // Table Columns
    const fields = [
        "courseCode",
        "comments",
        "courseObjective",
        "courseOfferCode",
        "credit",
        "concentration.name",
        "course.name",
        "courseType.name",
        "discipline.name",
        "specialization.name",
        "academicSession.academicSessionCode.term.description",
        "academicSession.academicSessionCode"
    ];

    const tableColumns = fields.map((field) => {
        let header;
    
        if (field === "academicSession.academicSessionCode.term.description") {
            header = t("courseOffer.term");
        } else if (field === "academicSession.academicSessionCode") {
            header = t("courseOffer.academicSession");
        } else {
            header = field.includes(".")
                ? t(`courseOffer.${field.split(".")[0]}`)
                : t(`courseOffer.${field}`);
        }
    
        return {
            field,
            header,
            sortable: true,
            editor: true,
        };
    });

    // Search Configuration
    const searchConfig = {
        type: "global",
        fields: [
            "course_code",
            "comments",
            "course_objective",
            "course_offer_code",
            "credit",
        ],
    };

    return (
        <CRUDPage
            entityName={t("courseOffer.header")}
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
};

export default CourseOffer;
