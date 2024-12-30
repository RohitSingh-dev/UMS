import {faFileAlt, faPenFancy, faSignOutAlt, faThLarge,} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink, useNavigate} from "react-router-dom";
import {logOut} from "../../Util/commonFunction.jsx";
import openPopupWindow from "../../services/PopupWindwoServiec.jsx";
import {useEffect, useState} from "react";

function StudentSideNavbar() {
    const navigate = useNavigate();


    return (
        <ul>
            <li className="menu-title">MAIN MENU</li>
            <li>
                <NavLink to="/student/dashboard">
                    <FontAwesomeIcon icon={faThLarge}/>
                    <span>Dashboard</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/student/marksheet">
                    <FontAwesomeIcon icon={faFileAlt}/>
                    <span>Marksheet</span>
                </NavLink>
            </li>
            <li className="menu-title">OTHERS</li>
            <li>
                <a href="#" onClick={() => logOut(navigate)}>
                    <FontAwesomeIcon icon={faSignOutAlt}/>
                    <span>SignOut</span>
                </a>
            </li>
        </ul>
    );
}

export default StudentSideNavbar;
