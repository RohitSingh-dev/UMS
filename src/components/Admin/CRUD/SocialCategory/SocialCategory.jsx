import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const SocialCategory = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search_data/search-social-category',
        toggleStatus: '/crud/social-category/change_status',
    }

    // Table Columns
    const fields = [
        "name",
        "is_certificate_required"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`socialCategory.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));

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