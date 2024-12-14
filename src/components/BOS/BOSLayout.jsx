import AllLayout from "../AllUser/AllLayout";
import AllSideBarNavLink from "../AllUser/AllSideBarNavLink";
import PropTypes from "prop-types";
import Breadcrumb from "../AllUser/BreadCrumb/Breadcrumb.jsx";
import {Toast} from "primereact/toast";
import BOSSideNavbar from "./SideNavbar";

const BOSLayout = ({children, breadcrumbItems, breadCrumbHeader,toastRef}) => {


    return (
        <AllLayout>
            {toastRef && <Toast ref={toastRef}/>}
            <AllSideBarNavLink>
                <BOSSideNavbar/>
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

BOSLayout.propTypes = {
    children: PropTypes.node.isRequired,
    breadcrumbItems: PropTypes.array,
    breadCrumbHeader: PropTypes.string,
    toastRef: PropTypes.object
};

export default BOSLayout;
