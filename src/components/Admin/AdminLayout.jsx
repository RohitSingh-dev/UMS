import AllLayout from "../AllUser/AllLayout";
import AllSideBarNavLink from "../AllUser/AllSideBarNavLink";
import PropTypes from "prop-types";
import Breadcrumb from "../AllUser/BreadCrumb/Breadcrumb.jsx";
import {Toast} from "primereact/toast";
import DraggableOverlay from "../../Util/PaymentTestModeWarning.jsx";
import SideNavBar from "../AllUser/SideNavBar.jsx";

const AdminLayout = ({children, breadcrumbItems, breadCrumbHeader, dialogBtn, dialogBtnLabel, toast}) => {

    return (
        <AllLayout>
            {toast && <Toast ref={toast}/>}
            {/*<DraggableOverlay/>*/}
            <AllSideBarNavLink>
                <SideNavBar/>
            </AllSideBarNavLink>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {breadcrumbItems && (
                        <div className="d-flex justify-content-between align-items-center">
                            <Breadcrumb
                                breadcrumbItems={breadcrumbItems}
                                header={breadCrumbHeader}
                            />
                            {dialogBtn && (
                                <button
                                    className="btn btn-primary"
                                    onClick={dialogBtn}
                                >
                                    {dialogBtnLabel || "Add New"}
                                </button>
                            )}
                        </div>
                    )}
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
    dialogBtn: PropTypes.func,
    dialogBtnLabel: PropTypes.string,
    toast: PropTypes.object
};

export default AdminLayout;
