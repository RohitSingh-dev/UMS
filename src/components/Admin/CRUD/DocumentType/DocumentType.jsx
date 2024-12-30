import CRUDPage from "../CRUDPage.jsx";

const DocumentType = () => {
    const apiEndpoints = {
        fetch: '/search_data/search-document-type',
        toggleStatus: '/crud/document_type/change_status',
    }

    const tableColumns = [
        {field: "description", header: "Description", sortable: true, editor: true},
        {field: "type", header: "Type", sortable: true, editor: true},
    ];

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