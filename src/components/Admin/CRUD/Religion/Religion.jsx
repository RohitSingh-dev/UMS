import CRUDPage from "../CRUDPage.jsx";

const Religion = () => {
    const apiEndpoints = {
        fetch: '/search_data/search-religions',
        toggleStatus: '/crud/religion/change_status',
    }
    const tableColumns = [
        {field: "name", header: "Name", sortable: true},
        {field: "is_active", header: "Status", sortable: true},
    ];

    const searchConfig = {
        type: 'global',
        fields: ['name']  // fields to search across
    };

    return (
        <CRUDPage
            entityName="Religion"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    )
}

export default Religion