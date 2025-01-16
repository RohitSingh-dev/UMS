import CRUDPage from "../CRUDPage";
import { useTranslation } from "react-i18next";

const StudentRegistration = () => {
    const { t } = useTranslation();
    const apiEndpoints = {
        fetch: '/search/users',
        toggleStatus: '/crud/registration/delete',
    }

    
      const tableColumns = [
        {field: "fullName", header: "Full Name", sortable: false, editor: true},
        {field: "discipline", header: "Program Offer", sortable: true, editor: true},
    ];

    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Name', value: 'name' },
            { label: 'Discipline', value: 'discipline' },
            { label: 'Program Offer', value: 'discipline' },
        ] // fields to search across
    };

    return (
        <CRUDPage
            entityName={t("student_registration.header")}
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default StudentRegistration;
