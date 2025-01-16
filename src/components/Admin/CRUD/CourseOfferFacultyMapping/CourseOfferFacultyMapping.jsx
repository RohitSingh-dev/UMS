import { useTranslation } from "react-i18next";
import CRUDPage from "../CRUDPage";

const CourseOfferFacultyMapping = () => {
    const { t } = useTranslation();
    
    //Need to add the api end point when backend is ready.
    // API Endpoints
    const apiEndpoints = {
        fetch: "/search_data/search-course-offer-faculty-mappings",
    };
    
    // Table Columns
    const fields = [
        "faculty_type",
        "course_offer",
        "faculty",
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`courseOfferFacultyMapping.${field}`),
        sortable: true,
        editor: true,
    }));

    // Search Configuration
    const searchConfig = {
        type: "global",
        fields: [
            "faculty_type",
        ],
    };

    return (
        <CRUDPage
            entityName={t("courseOfferFacultyMapping.header")}
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default CourseOfferFacultyMapping;