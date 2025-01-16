import AdminLayout from "../AdminLayout.jsx";
import LinkButton from "../../AllUser/LinkButton.jsx";

const MasterReport = () => {
    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "Master Report"}
    ];

    return (
        <AdminLayout breadcrumbItems={breadcrumbData}>
            <div className='row'>
                <LinkButton url='student-info' name='Student Information'/>
                <LinkButton url='courses-info' name='Courses Information'/>
                <LinkButton url='grades-academic-performance' name='Grades and Academic Performance'/>
                <LinkButton url='cqmi-merit' name='CQPI and Merit'/>
                <LinkButton url='batch-wise-program-info' name='Batch-wise and Program Information'/>
                <LinkButton url='transcripts' name='Transcripts'/>
            </div>
        </AdminLayout>
    )
}

export default MasterReport