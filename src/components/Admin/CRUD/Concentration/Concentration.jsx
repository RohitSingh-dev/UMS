import CRUDPage from "../CRUDPage";
import { useTranslation } from "react-i18next";

const Concentration = () => {
    const { t } = useTranslation();
    const apiEndpoints = {
        fetch: '/search/concentrations',
        editRecord: '/crud/concentration/update',
        toggleStatus: '/crud/concentration/change_status',
        delete: '/crud/concentration/delete'
    }

    const tableColumns = [
        {field: "name", header: t("concentration.name"), sortable: true, editor: true},
        {field: "specialization.name", header: t("concentration.specializationName"), sortable: true, editor: true},
        {field: "concentrationCode", header: t("concentration.connection_code"), sortable: true, editor: true},
    ];

    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Name', value: 'name' },
            { label: 'Connection Code', value: 'connection_code' },
        ]// fields to search across
    };

    return (    
        <CRUDPage
            entityName="Concentration"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default Concentration;
