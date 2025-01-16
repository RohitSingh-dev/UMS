import CRUDPage from "../CRUDPage.jsx";

const Term = () => {
    const apiEndpoints = {
        fetch: '/search/terms',
        editRecord: '/crud/term/update',
        delete: '/crud/term/delete'
    }

    const tableColumns = [
        {field: "description", header: "Description", sortable: true, editor: true},
        {field: "numericValue", header: "Numeric Value", sortable: true, editor: true},
        {field: "termCode", header: "Term Code", sortable: true, editor: true}
    ];


    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Description', value: 'description' },
            { label: 'Numeric value', value: 'numericValue' },
            { label: 'Term Code', value: 'termCode' }
        ]
    };

    return (
        <CRUDPage
            entityName="Term"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default Term