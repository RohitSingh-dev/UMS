import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const DocumentType = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search_data/search-document-type',
        toggleStatus: '/crud/document_type/change_status',
    }

    const fields = [
        "description",
        "type"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`documentType.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));

    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Description', value: 'description' },
            { label: 'Type', value: 'type' }
        ]
    };

    return (
        <CRUDPage
            entityName="Document Type"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default DocumentType