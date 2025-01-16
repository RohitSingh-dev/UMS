import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const AcademicSession = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search/academic-sessions',
        editRecord: '/crud/academic-session/update',
        delete: '/crud/academic-session/delete',
    }

    // Table Columns
    const fields = [
        "academicSessionCode",
        "endTerm",
        "midTerm",
        "startDate",
        "endDate",
        "programOffer.program.name",
        "status"
    ];

    const statusTemplate = (rowData) => (
        <span className={`badge ${rowData.status ? 'badge-success' : 'badge-danger'}`}>
        {rowData.status ? "Open" : "Close"}
    </span>
    );

    const midTerm = (rowData) => (
        <span>{rowData.midTerm ? "Yes" : "No"}</span>
    );

    const endTerm = (rowData) => (
        <span>{rowData.endTerm ? "Yes" : "No"}</span>
    );

// Function to map field names to corresponding body templates
    const getBodyTemplate = (field) => {
        const templateMap = {
            'status': statusTemplate,
            'midTerm': midTerm,
            'endTerm': endTerm
        };

        return templateMap[field] || null; // Default to null if no matching template is found
    };

    const tableColumns = fields.map((field) => {
        const column = {
            field,
            header: field === "programOffer.program.name"
                ? t("academicSession.program")
                : t(`academicSession.${field}`),
            sortable: field !== 'status',
            editor: field !== 'status',
            body: getBodyTemplate(field), // Set body template dynamically
        };

        return column;
    });


    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Code', value: 'academic_session_code' },
            { label: 'End Term', value: 'end_term' },
            { label: 'Mid Term', value: 'mid_term' },
            { label: 'Start Date', value: 'start_date' },
            { label: 'End Date', value: 'end_date' },
            { label: 'Program Offer Id', value: 'program_offer_id' },
            { label: 'Term Id', value: 'term_id' },
        ]
    };

    return (
        <CRUDPage
            entityName="Academic Session"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default AcademicSession