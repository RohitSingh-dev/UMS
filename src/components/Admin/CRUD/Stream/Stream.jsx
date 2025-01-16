import CRUDPage from "../CRUDPage.jsx";

const Stream = () => {
    const apiEndpoints = {
        fetch: '/search/streams',
        editRecord: '/crud/stream/update',
        delete: '/crud/term/delete',
    }

    const tableColumns = [
        {field: "name", header: "Name", sortable: true, editor: true},
        {field: "shortName", header: "Short Name", sortable: true, editor: true},
        {field: "streamCode", header: "Area Code", sortable: true, editor: true}
    ];


    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Name', value: 'name' },
            { label: 'Short Name', value: 'shortName' },
            { label: 'Stream Code', value: 'streamCode' }
        ]
    };

    return (
        <CRUDPage
            entityName="Area"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default Stream