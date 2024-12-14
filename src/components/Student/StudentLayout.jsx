import AllLayout from "../AllUser/AllLayout";
import AllSideBarNavLink from "../AllUser/AllSideBarNavLink";
import StudentSideNavbar from "./SideNavbar";
import PropTypes from "prop-types";
import {useEffect} from "react";
import webSocketService from "../../services/WebSocketService.jsx";

const StudentLayout = ({children}) => {
    useEffect(() => {
        webSocketService.connect();
        return (()=> webSocketService.disconnect())
    }, []);

    return (
        <AllLayout>
            <AllSideBarNavLink>
                <StudentSideNavbar/>
            </AllSideBarNavLink>
            <div className="page-wrapper">
                <div className="content container-fluid">{children}</div>
            </div>
        </AllLayout>
    );
};

StudentLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default StudentLayout;
