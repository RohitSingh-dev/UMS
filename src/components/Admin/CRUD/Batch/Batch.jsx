import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const Batch = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search_data/search-batch',
        editRecord: '/crud/batch/change_status',
    }

    const fields = [
        "name",
        "year"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`batch.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));

    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Name', value: 'name' },
            { label: 'Year', value: 'year' }
        ]
    };

    return (
        <CRUDPage
            entityName="Batch"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default Batch