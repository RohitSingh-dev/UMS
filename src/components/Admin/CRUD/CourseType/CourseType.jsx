import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const CourseType = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search/course-types',
        toggleStatus: '/crud/question_type/change_status',
        editRecord: '/crud/course-type/update',
        delete: '/crud/course-type/delete',
    }

    // Table Columns
    const fields = [
        "name",
        "shortName",
        "courseTypeCode"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`courseType.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));

    const searchConfig = {
        type: 'global',
        fields: ['name']  // fields to search across
    };

    return (
        <CRUDPage
            entityName={t("courseType.header")}
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default CourseType;
