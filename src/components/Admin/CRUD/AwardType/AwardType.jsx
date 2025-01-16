import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const AwardType = () => {
    const { t } = useTranslation();
    const apiEndpoints = {
        fetch: '/admin/search-award-type',
        editRecord: '/crud/district/:id/update_state'
    }

    // Table Columns
    const fields = [
        "name"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`awardType.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));


    const searchConfig = {
        type: 'global',
        field: 'name'
    };

    return (
        <CRUDPage
            entityName="Award Type"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default AwardType