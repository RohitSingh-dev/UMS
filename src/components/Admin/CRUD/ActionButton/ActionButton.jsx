import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const ActionButton = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search_data/action-button/search',
        editRecord: '/crud/action-button/update',
        toggleStatus: '/crud/action-button/change_status',
    }

    // Table Columns
    const fields = [
        "name",
        "path",
        "icon",
        "isActive"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`actionButton.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));


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