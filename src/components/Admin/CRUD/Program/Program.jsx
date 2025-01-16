import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const Program = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search/programs',
        toggleStatus: '/crud/program/change_status',
        editRecord: '/crud/program/update',
        delete: '/crud/program/delete'
    }

    // Table Columns
    const fields = [
        "longName",
        "name",
        "programCode"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`program.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));

    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Long Name', value: 'longName' },
            { label: 'Name', value: 'name' },
            { label: 'Program Code', value: 'programCode' }
        ]
    };

    return (
        <CRUDPage
            entityName="Program"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default Program