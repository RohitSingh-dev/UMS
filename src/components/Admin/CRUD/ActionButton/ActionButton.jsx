import CRUDPage from "../CRUDPage.jsx";

const ActionButton = () => {

    const apiEndpoints = {
        fetch: '/search_data/action-button/search',
        editRecord: '/crud/action-button/update',
        toggleStatus: '/crud/action-button/change_status',
    }

    const tableColumns = [
        {field: "name", header: "Name", sortable: true, editor: true},
        {field: "path", header: "Path", sortable: true, editor: true},
        {field: "icon", header: "Icon", editor: true},
        {field: "isActive", header: "Status"}
    ];


    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Name', value: 'name' },
            { label: 'Path', value: 'action_button_path' }
        ]
    };

    return (
        <CRUDPage
            entityName="Action Button"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default ActionButton