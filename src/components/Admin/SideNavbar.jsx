import {faCog, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink, useNavigate} from "react-router-dom";
import {logOut} from "../Util/commonFunction";
import {useDispatch} from "react-redux";


function AdminSideNavbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();



    return (
        <ul>
            <li className="menu-title">MAIN MENU</li>
            <li>
                <NavLink to="/admin/dashboard">
                    <FontAwesomeIcon icon="fa-solid fa-th-large"/>
                    <span>Dashboard</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/admin/crud">
                    <FontAwesomeIcon icon="fa-solid fa-user-tie" />
                    <span>CURD</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/settings">
                    <FontAwesomeIcon icon={faCog}/>
                    <span>Settings</span>
                </NavLink>
            </li>
            <li className="menu-title">OTHERS</li>
            <li>
                <NavLink to="/" onClick={() => logOut(navigate, dispatch)}>
                    <FontAwesomeIcon icon={faSignOutAlt}/>
                    <span>SignOut</span>
                </NavLink>
            </li>
        </ul>
    );
}

export default AdminSideNavbar;
