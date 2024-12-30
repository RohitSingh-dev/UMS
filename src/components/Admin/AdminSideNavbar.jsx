import {
    faChevronDown,
    faChevronRight,
    faCog,
    faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink, useNavigate} from "react-router-dom";
import {logOut} from "../../Util/commonFunction.jsx";
import {useDispatch} from "react-redux";
import {useState} from "react";


function AdminSideNavbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prevState) => !prevState);
    };


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
                <a href="#" onClick={toggleDropdown} className="justify-content-between">
                    <div>
                        <FontAwesomeIcon icon="fa-solid fa-user-tie" />
                        <span>CRUD</span>
                    </div>
                    {isOpen? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
                </a>
                {isOpen &&
                    <ul style={{display: "block"}}>
                        <li className="p-0">
                            <NavLink to="/admin/crud/question-types"> <span>Question Type</span></NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/crud/user"> <span>User</span></NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/crud/menu"> <span>Menu</span></NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/crud/role-menu-mapping"> <span>Role Menu Mapping</span></NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/crud/action-button"> <span>Action Button</span></NavLink>
                        </li>
                    </ul>}
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
