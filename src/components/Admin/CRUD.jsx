import AdminLayout from "./AdminLayout.jsx";
import LinkButton from "../AllUser/LinkButton.jsx";

const CRUD = () => {
    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD"}
    ];
    return (
        <AdminLayout breadcrumbItems={breadcrumbData}>
            <div className='row'>
                <LinkButton url='question-types' name='Question Type'/>
                <LinkButton url='user' name='User'/>
                <LinkButton url='menu' name='Menu'/>
                <LinkButton url='role-menu-mapping' name='Role Menu Mapping'/>
                <LinkButton url='action-button' name='Action Button'/>
                <LinkButton url='document-type' name='Document Type'/>
                <LinkButton url='religion' name='Religion'/>
                <LinkButton url='social-category' name='Social Category'/>
                <LinkButton url='state' name='State'/>
                <LinkButton url='district' name='District'/>
                <LinkButton url='award-type' name='Award Type'/>
                <LinkButton url='program' name='Program'/>
                <LinkButton url='program-offer' name='Program Offer'/>
                <LinkButton url='term' name='Term'/>
                <LinkButton url='stream' name='Stream'/>
                <LinkButton url='academic-session' name='Academic Session'/>
                <LinkButton url='grivence' name='Grivence'/>
                <LinkButton url='course-offer' name='Course Offer'/>
                <LinkButton url='course-offer-faculty-mapping' name='Course Offer Faculty Mapping'/>
                <LinkButton url='student-personal-details' name='Student Personal Details'/>
                <LinkButton url='activity-master-list' name='Activity Master List'/>
                <LinkButton url='specialization' name='Specialization'/>
                <LinkButton url='concentration' name='Concentration'/>
                <LinkButton url='discipline' name='Discipline'/>
                <LinkButton url='courses' name='Courses'/>
                <LinkButton url='registration' name='Registration'/>
                <LinkButton url='batch' name='Batch'/>
                <LinkButton url='student-registration' name='Student Registration'/>
            </div>
        </AdminLayout>
    )
}

export default CRUD