import CRUDPage from "../CRUDPage";
import { useTranslation } from "react-i18next";

const Specialization = () => {
    const { t } = useTranslation();
    const apiEndpoints = {
        fetch: '/search/specializations',
        toggleStatus: '/crud/specialization/change_status',
        editRecord: '/crud/specialization/update',
        delete: '/crud/specialization/delete'
    }

    const tableColumns = [
        {field: "name", header: t("specialization.name"), sortable: true, editor: true},
        {field: "stream.name", header: t("specialization.streamName"), sortable: true, editor: true},
        {field: "programOffer.program.name", header: t("specialization.programOfferName"), sortable: true, editor: true},
        {field: "specializationCode", header: t("specialization.specializationCode"), sortable: true, editor: true},
    ];

    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Name', value: 'name' },
            { label: 'Specialization Code', value: 'specialization_code' },
        ]
    };

    return (
        <CRUDPage
            entityName={t("specialization.header")}
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default Specialization;
