import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const Religion = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search_data/search-religions',
        toggleStatus: '/crud/religion/change_status',
    }

    // Table Columns
    const fields = [
        "name",
        "is_active"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`program.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));

    const searchConfig = {
        type: 'global',
        fields: ['name']  // fields to search across
    };

    return (
        <CRUDPage
            entityName="Religion"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    )
}

export default Religion