import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const District = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/admin/search-district',
        editRecord: '/crud/district/:id/update_state'
    }

    // Table Columns
    const fields = [
        "code",
        "name",
        "shortName"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`district.${field}`),
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
            entityName="District"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default District