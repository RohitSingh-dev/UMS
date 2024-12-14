import AllLayout from "../AllUser/AllLayout";
import AllSideBarNavLink from "../AllUser/AllSideBarNavLink";
import PropTypes from "prop-types";
import Breadcrumb from "../AllUser/BreadCrumb/Breadcrumb.jsx";
import {Toast} from "primereact/toast";
import {useSelector} from 'react-redux';
import SideNavBar from "../AllUser/SideNavBar.jsx";


const TeacherLayout = ({children, breadcrumbItems, breadCrumbHeader,toastRef}) => {

    const sideBarClass = useSelector((state) => state.sidebar.sideBarClass);

    return (
        <AllLayout>
            {toastRef && <Toast ref={toastRef}/>}
            <AllSideBarNavLink>
                <SideNavBar/>
            </AllSideBarNavLink>
            <div className={`page-wrapper ${sideBarClass}`}>
                <div className="content container-fluid">
                    {breadcrumbItems && <Breadcrumb breadcrumbItems={breadcrumbItems} header={breadCrumbHeader}/>}
                    {children}
                </div>
            </div>
        </AllLayout>
    );
};

TeacherLayout.propTypes = {
    children: PropTypes.node.isRequired,
    breadcrumbItems: PropTypes.array,
    breadCrumbHeader: PropTypes.string,
    toastRef: PropTypes.object
};

export default TeacherLayout;
