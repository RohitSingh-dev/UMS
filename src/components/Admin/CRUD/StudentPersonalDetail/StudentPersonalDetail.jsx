import {useTranslation} from "react-i18next";
import CRUDPage from "../CRUDPage.jsx";

const StudentPersonalDetail = () => {
    const { t } = useTranslation();

    const apiEndpoints = {
        fetch: '/search_data/student-personal-details/search',
        editRecord: '/crud/student-personal-details/update'
    }

    // Table Columns
    const fields = [
        "aadhar_number",
        "blood_group",
        "date_of_birth",
        "father_name",
        "gender",
        "identification_mark",
        "marital_status",
        "mother_name",
        "mother_tongue",
        "nationality",
        "pan_number",
        "passport_number",
        "spouse_name",
        "admission_category_id",
        "religion_id",
        "social_category_id",
        "user_id"
    ];

    const tableColumns = fields.map((field) => ({
        field,
        header: t(`studentPersonalDetail.${field}`),
        sortable: field !== 'status',
        editor: field !== 'status',
    }));


    const searchConfig = {
        type: 'column',
        columns: [
            { label: 'Aadhar Number', value: 'aadhar_number' },
            { label: 'Blood Group', value: 'blood_group' },
            { label: 'Date of Birth', value: 'date_of_birth' },
            { label: 'Father Name', value: 'father_name' },
            { label: 'Gender', value: 'gender' },
            { label: 'Identification Mark', value: 'identification_mark' },
            { label: 'Marital Status', value: 'marital_status' },
            { label: 'Mother Name', value: 'mother_name' },
            { label: 'Mother Tongue', value: 'mother_tongue' },
            { label: 'Nationality', value: 'nationality' },
            { label: 'Pan Number', value: 'pan_number' },
            { label: 'Passport Number', value: 'passport_number' },
            { label: 'Spouse Name', value: 'spouse_name' },
            { label: 'Admission Category Id', value: 'admission_category_id' },
            { label: 'Religion Id', value: 'religion_id' },
            { label: 'Social Category Id', value: 'social_category_id' },
            { label: 'User Id', value: 'user_id' },
        ]
    };

    return (
        <CRUDPage
            entityName="Student Personal Details"
            apiEndpoints={apiEndpoints}
            columns={tableColumns}
            searchConfig={searchConfig}
            isEditable={true}
        />
    );
}

export default StudentPersonalDetail