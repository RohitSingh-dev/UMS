import CRUDPage from "../CRUDPage.jsx";

const AwardType = () => {
    const apiEndpoints = {
        fetch: '/admin/search-award-type',
        editRecord: '/crud/district/:id/update_state'
    }

    const tableColumns = [
        {field: "name", header: "Name", sortable: true, editor: true}
    ];


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