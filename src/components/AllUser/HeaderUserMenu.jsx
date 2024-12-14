import {faBell, faGlobe} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import userPic from "../../assets/UserDocument/Images/avatar.jpg";
import {useEffect, useRef, useState} from "react";
import {ROLE_COOKIES_NAME, USERNAME_COOKIES_NAME} from "../Util/AppConstant.jsx";
import {NavLink, useNavigate} from "react-router-dom";
import {logOut} from "../Util/commonFunction.jsx";
import CookieHelper from "../../services/UseCookies.jsx";

function HeaderUserMenu() {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const parsedRole = JSON.parse(CookieHelper.getCookie(ROLE_COOKIES_NAME));
    const profileUrl = parsedRole[0]?.authority === "ROLE_TEACHER" ? '/teacher/settings' : parsedRole[0]?.authority === "ROLE_ADMIN" ? '/settings' : '/bos/settings';
    const navigate = useNavigate();

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setIsProfileOpen(false);
        setIsLanguageOpen(false);
    };
    const toggleLanguage = () => {
        setIsLanguageOpen(!isLanguageOpen);
        setIsProfileOpen(false);
        setIsNotificationOpen(false);
    }
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsNotificationOpen(false);
        setIsLanguageOpen(false);
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
            setIsLanguageOpen(false);
        }
    };

    useEffect(() => {
        if (isProfileOpen || isNotificationOpen || isLanguageOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLanguageOpen, isProfileOpen, isNotificationOpen]);

    return (
        <ul className="nav user-menu">
            {/* <!-- Notifications --> */}
            <li className="nav-item dropdown noti-dropdown" ref={dropdownRef}>
                <a href="#" className="dropdown-toggle nav-link" onClick={toggleNotification}>
                    <i><FontAwesomeIcon icon={faBell}/></i> <span className="badge badge-pill">3</span>
                </a>
                {isNotificationOpen && (
                    <div className="dropdown-menu notifications" style={{transform: "translate3d(-195px, 5px, 0px)"}}>
                        <div className="topnav-dropdown-header">
                            <span className="notification-title">Notifications</span>
                            <a href="#" className="clear-noti">{" "}Clear All{" "} </a>
                        </div>
                        <div className="noti-content">
                            <ul className="notification-list">
                                <li className="notification-message">
                                    <a href="#">
                                        <div className="media">
                                        <span className="avatar avatar-sm">
                                            <img className="avatar-img rounded-circle" alt="User Image"
                                                 src={userPic}></img>
                                        </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span
                                                    className="noti-title">Carlson Tech</span> has approved <span
                                                    className="noti-title">your estimate</span></p>
                                                <p className="noti-time"><span
                                                    className="notification-time">4 mins ago</span></p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li className="notification-message">
                                    <a href="#">
                                        <div className="media">
                                        <span className="avatar avatar-sm">
                                            <img className="avatar-img rounded-circle" alt="User Image"
                                                 src={userPic}></img>
                                        </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">International Software Inc</span> has
                                                    sent
                                                    you a invoice in the amount of <span className="noti-title">$218</span>
                                                </p>
                                                <p className="noti-time"><span
                                                    className="notification-time">6 mins ago</span></p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li className="notification-message">
                                    <a href="#">
                                        <div className="media">
                                        <span className="avatar avatar-sm">
                                            <img className="avatar-img rounded-circle" alt="User Image"
                                                 src={userPic}></img>
                                        </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span
                                                    className="noti-title">John Hendry</span> sent a cancellation
                                                    request <span className="noti-title">Apple iPhone XR</span></p>
                                                <p className="noti-time"><span
                                                    className="notification-time">8 mins ago</span></p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li className="notification-message">
                                    <a href="#">
                                        <div className="media">
                                        <span className="avatar avatar-sm">
                                            <img className="avatar-img rounded-circle" alt="User Image"
                                                 src={userPic}></img>
                                        </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Mercury Software Inc</span> added
                                                    a new
                                                    product <span className="noti-title">Apple MacBook Pro</span></p>
                                                <p className="noti-time"><span
                                                    className="notification-time">12 mins ago</span></p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="topnav-dropdown-footer">
                            <a href="#">View all Notifications</a>
                        </div>
                    </div>
                )}
            </li>
            {/*Notifications*/}
            <li className="nav-item dropdown" ref={dropdownRef}>
                <a href="#" className="dropdown-toggle nav-link" onClick={toggleLanguage}>
                    <i><FontAwesomeIcon icon={faGlobe}/></i>
                </a>
                {isLanguageOpen && (
                    <div className="dropdown-menu" style={{transform: "translate3d(-55px, 5px, 0px)"}}>
                        <a className="dropdown-item" href="#">English</a>
                        <a className="dropdown-item" href="#">Hindi</a>
                        <a className="dropdown-item" href="#">Bengali</a>
                    </div>
                )}
            </li>
            {/*User Menu*/}
            <li className="nav-item dropdown has-arrow" ref={dropdownRef}>
                <a href="#" className="dropdown-toggle nav-link" onClick={toggleProfile}>
            <span className="user-img rounded-circle"><img className="rounded-circle"
                                                           src={userPic} alt="profile"></img></span>
                </a>
                {isProfileOpen && (
                    <div className="dropdown-menu" style={{transform: "translate3d(-110px, 5px, 0px)"}}>
                        <div className="user-header">
                            <div className="user-text">
                                <h6>{CookieHelper.getCookie(USERNAME_COOKIES_NAME)}</h6>
                                <p className="text-muted mb-0">{parsedRole[0]?.authority.replace("ROLE_", "")}</p>
                            </div>
                        </div>
                        <NavLink to={profileUrl} className="dropdown-item">My Profile</NavLink>
                        <NavLink to="#" className="dropdown-item">Inbox</NavLink>
                        <NavLink to="#" onClick={() => logOut(navigate)} className="dropdown-item">Logout</NavLink>
                    </div>
                )}
            </li>
            {/*User Menu*/}
        </ul>
    );
}

export default HeaderUserMenu;
