import CRUDPage from "../CRUDPage";
import { useTranslation } from "react-i18next";

const Registration = () => {
    const { t } = useTranslation();
    const apiEndpoints = {
        fetch: '/search_data/search-registration',
        toggleStatus: '/crud/registration/change_status',
    }

    // Table Columns
    const fields = [
        "name",
        "roll",
        "program",
        "academic_year",
        "batch",
        "term",
        "course",
        "course_type",
        "course_code",
        "specialization_name"
    ];
    const tableColumns = fields.map((field) => ({
      field,
      header: t(`Registration.${field}`),
      sortable: true,
      editor: true,
      }));

    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Name', value: 'name' },
            { label: 'Roll', value: 'roll' },
            { label: 'Program', value: 'program' },
            { label: 'Academic Year', value: 'academic year' },
            { label: 'Batch', value: 'batch' },
            { label: 'Term', value: 'term' },
            { label: 'Course', value: 'course' },
            { label: 'Course Type', value: 'course type' },
            { label: 'Course Code', value: 'course code' },
            { label: 'Specialization Name', value: 'specialization name' },
        ] // fields to search across
    };

    return (
        <CRUDPage
            entityName={t("Registration.header")}
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default Registration;
