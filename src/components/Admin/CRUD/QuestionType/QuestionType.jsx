import CRUDPage from "../CRUDPage.jsx";

const QuestionType = () => {
    const apiEndpoints = {
        fetch: '/search_data/search-question-types',
        toggleStatus: '/crud/question_type/change_status',
        editRecord: '/crud/question_type/edit'
    }

    const tableColumns = [
        {field: "type", header: "Question Type", sortable: true, editor: true},
        {field: "is_active", header: "Status", sortable: true},
    ];

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
