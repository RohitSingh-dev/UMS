import CRUDPage from "../CRUDPage";
import { useTranslation } from "react-i18next";

const Discipline = () => {
    const { t } = useTranslation();
    const apiEndpoints = {
        fetch: '/search/disciplines',
        toggleStatus: '/crud/descipline/change_status',
        delete: '/crud/discipline/delete',
    }

    // Table Columns
    const fields = [
        "name",
        "disciplineCode",
        "noOfSemesterInterval",
        "number",
        "shortCode",
        "programOffer.program.name",
    ];

    const tableColumns = fields.map((field) => ({
      field,
      header: field === "programOffer.program.name" 
            ? t("discipline.program") 
            : t(`discipline.${field}`),
      sortable: true,
      editor: true,
      }));

    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Name', value: 'name' },
            { label: 'Discipline Code', value: 'discipline_code' },
            { label: 'No Of Semester Interval', value: 'no_of_semester_interval' },
            { label: 'Number', value: 'number' },
            { label: 'Short Code', value: 'short_code' },
        ]  // fields to search across
    };

    return (
        <CRUDPage
            entityName={t("discipline.header")}
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default Discipline;
