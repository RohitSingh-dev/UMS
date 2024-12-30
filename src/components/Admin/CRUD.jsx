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
                <LinkButton url='grivence' name='Grivence'/>
            </div>
        </AdminLayout>
    )
}

export default CRUD