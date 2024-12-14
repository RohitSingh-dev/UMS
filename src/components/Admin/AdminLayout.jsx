import AllLayout from "../AllUser/AllLayout";
import AllSideBarNavLink from "../AllUser/AllSideBarNavLink";
import PropTypes from "prop-types";
import Breadcrumb from "../AllUser/BreadCrumb/Breadcrumb.jsx";
import {Toast} from "primereact/toast";
import DraggableOverlay from "../Util/PaymentTestModeWarning.jsx";
import SideNavBar from "../AllUser/SideNavBar.jsx";

const AdminLayout = ({children, breadcrumbItems, breadCrumbHeader, toast}) => {

    return (
        <AllLayout>
            {toast && <Toast ref={toast}/>}
            <DraggableOverlay/>
            <AllSideBarNavLink>
                <SideNavBar/>
            </AllSideBarNavLink>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {breadcrumbItems && <Breadcrumb breadcrumbItems={breadcrumbItems} header={breadCrumbHeader}/>}
                    {children}
                </div>
            </div>
        </AllLayout>
    );
};

AdminLayout.propTypes = {
    children: PropTypes.node.isRequired,
    breadCrumbHeader: PropTypes.string,
    breadcrumbItems: PropTypes.array,
    toast: PropTypes.object
};

export default AdminLayout;
