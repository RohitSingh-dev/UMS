import CRUDPage from "../CRUDPage";
import {useTranslation} from "react-i18next";


const Courses = () => {
    const {t} = useTranslation();
    const apiEndpoints = {
        fetch: '/search/courses',
        toggleStatus: '/crud/courses/change_status',
        editRecord: '/crud/course/update',
        delete: '/crud/course/delete'
    }

    const statusTemplate = (rowData) => (
        <span className={`badge ${rowData.status ? 'badge-success' : 'badge-danger'}`}>
        {rowData.status ? "Open" : "Close"}
        </span>
    );


    const tableColumns = [
        {field: "name", header: t("courses.name"), sortable: true, editor: true},
        {field: "courseIdCode", header: t("courses.course_id_code"), sortable: true, editor: true},
        {field: "shortName", header: t("courses.short_name"), sortable: true, editor: true},
        {field: "status", header: t("courses.is_active"), sortable: true, editor: true, body: statusTemplate},
    ];

    const searchConfig = {
        type: 'column',
        columns: [
            {label: 'Name', value: 'name'},
            {label: 'Course Objective', value: 'course_objective'},
            {label: 'Short Name', value: 'short_name'},
            {label: 'Syllabus', value: 'syllabus'},
        ]
    };


    return (
        <CRUDPage
            entityName={t("courses.header")}
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default Courses;
