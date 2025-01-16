import CRUDPage from "../CRUDPage.jsx";
import {useTranslation} from "react-i18next";

const ActivityMasterList = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search_data/search-activity-master-list',
        editRecord: '/crud/activity-master-list/edit',
    }

    // Table Columns
    const fields = [
        "university_name",
        "activity_id",
        "paper_id",
        "paper_code",
        "full_marks",
        "activity_type",
        "activity_session",
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`activityMasterList.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));

    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'University Name', value: 'university_name' },
            { label: 'Activity Id', value: 'activity_id' },
            { label: 'Paper Id', value: 'paper_id' },
            { label: 'Paper Code', value: 'paper_code' },
            { label: 'Full Marks', value: 'full_marks' },
            { label: 'Activity Type', value: 'activity_type' },
            { label: 'Activity Session', value: 'activity_session' },
        ]
    };

    return (
        <CRUDPage
            entityName="Activity Master List"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default ActivityMasterList