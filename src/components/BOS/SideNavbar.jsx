import {faBook, faCog, faSignOutAlt, faThLarge, faUserGear,} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink, useNavigate} from "react-router-dom";
import {logOut} from "../Util/commonFunction";
import {useDispatch} from "react-redux";


function BOSSideNavbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    return (
        <ul>
            <li className="menu-title">MAIN MENU</li>
            <li>
                <NavLink to="/bos/dashboard">
                    <FontAwesomeIcon icon={faThLarge}/>
                    <span>Dashboard</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/bos/question-paper-configuration">
                    <FontAwesomeIcon icon={faBook}/>
                    <span>Question Bank Configuration</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/bos/paper-setter-configuration">
                    <FontAwesomeIcon icon={faUserGear}/>
                    <span>Paper Setter Configuration</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/bos/settings">
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

export default BOSSideNavbar;
