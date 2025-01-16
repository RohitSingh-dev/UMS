import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const State = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/admin/search-state',
        editRecord: '/crud/state/:id/update_state'
    }

    // Table Columns
    const fields = [
        "code",
        "name",
        "shortName"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`state.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));

    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Code', value: 'Code' },
            { label: 'Name', value: 'Name' },
            { label: 'Short Name', value: 'shortName' }
        ]
    };

    return (
        <CRUDPage
            entityName="State"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default State