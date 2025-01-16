import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const QuestionType = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search_data/search-question-types',
        toggleStatus: '/crud/question_type/change_status',
        editRecord: '/crud/question_type/edit'
    }

    // Table Columns
    const fields = [
        "type",
        "is_active"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`questionType.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));

    const searchConfig = {
        type: 'global',
        fields: ['type']  // fields to search across
    };

    return (
        <CRUDPage
            entityName="Question Type"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default QuestionType;
