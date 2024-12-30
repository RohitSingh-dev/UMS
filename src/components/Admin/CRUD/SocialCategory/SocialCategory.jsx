import CRUDPage from "../CRUDPage.jsx";

const SocialCategory = () => {
    const apiEndpoints = {
        fetch: '/search_data/search-social-category',
        toggleStatus: '/crud/social-category/change_status',
    }

    const tableColumns = [
        {field: "name", header: "Name", sortable: true, editor: true},
        {field: "is_certificate_required", header: "Certificate Required"},
    ];

    const searchConfig = {
        type: 'global',
        fields: ['name']  // fields to search across
    };

    return (
        <CRUDPage
            entityName="Social Category"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default SocialCategory