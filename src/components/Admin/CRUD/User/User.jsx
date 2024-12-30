import CRUDPage from "../CRUDPage.jsx";

const User = () => {
    const apiEndpoints = {
        fetch: '/admin/search-user',
        editRecord: '/crud/question_type/:id/update_type'
    }

    const tableColumns = [
        {field: "name", header: "Name", sortable: true, editor: true},
        {field: "mobile", header: "Mobile", sortable: true, editor: true},
        {field: "userName", header: "User Name", sortable: true, editor: true},
        {field: "userPersonalDetail.designation.name", header: "Designation", sortable: true, editor: true},
    ];


    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Name', value: 'name' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Username', value: 'userName' },
            { label: 'Designation', value: 'designation' }
        ]
    };

    return (
        <CRUDPage
            entityName="User"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default User;
