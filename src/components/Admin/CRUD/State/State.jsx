import CRUDPage from "../CRUDPage.jsx";

const State = () => {
    const apiEndpoints = {
        fetch: '/admin/search-state',
        editRecord: '/crud/state/:id/update_state'
    }

    const tableColumns = [
        {field: "code", header: "Code", sortable: true, editor: true},
        {field: "name", header: "Name", sortable: true, editor: true},
        {field: "shortName", header: "Short Name", sortable: true, editor: true}
    ];


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