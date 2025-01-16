import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const ProgramOffer = () => {
    const { t } = useTranslation();
    const apiEndpoints = {
        fetch: '/search/program-offers',
        delete: '/crud/program-offer/delete'
    }

    const fields = [
        "program.name",
        "programOfferCode",
        "startDate",
        "endDate",
        "status"
    ];

    const statusTemplate = (rowData) => (
        <span className={`badge ${rowData.status ? 'badge-success' : 'badge-danger'}`}>
        {rowData.status ? "Open" : "Close"}
    </span>
    );

    const getBodyTemplate = (field) => {
        const templateMap = {
            'status': statusTemplate,
        };

        return templateMap[field] || null; // Default to null if no matching template is found
    };

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`programOffer.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
        body: getBodyTemplate(field)
    }));

    const searchConfig = {
        type: 'global',
        fields: ['programOfferCode']
    };

    return (
        <CRUDPage
            entityName="Program Offer"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default ProgramOffer