import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink, useNavigate} from "react-router-dom";
import {logOut} from "../Util/commonFunction";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {setMenus} from "../../Redux/sidebarSlice.jsx";
import apiCall from "../../Axios/APIHelper.jsx";


function SideNavBar() {
    const navigate = useNavigate();
    const menus = useSelector((state) => state.sidebar.menus);
    const dispatch = useDispatch();

    useEffect(() => {
        if (menus.length === 0) {
            apiCall({
                url: '/user/menus',
                method: 'get',
                showLoadingIndicator: false
            })
                .then(data => {
                    dispatch(setMenus(data))
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }, [])


    return (
        <ul>
            <li className="menu-title">MAIN MENU</li>
            {menus.map((menu) => (
                <li key={menu.id}>
                    <NavLink to={menu.path}>
                        <FontAwesomeIcon icon={menu.icon}/>
                        <span>{menu.name}</span>
                    </NavLink>
                </li>
            ))}
            <li className="menu-title">OTHERS</li>
            <li>
                <a href="#" onClick={() => logOut(navigate,dispatch)}>
                    <FontAwesomeIcon icon={faSignOutAlt}/>
                    <span>SignOut</span>
                </a>
            </li>
        </ul>
    );
}

export default SideNavBar;
