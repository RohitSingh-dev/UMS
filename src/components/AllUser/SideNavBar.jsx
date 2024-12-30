import {faChevronRight, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate} from "react-router-dom";
import {logOut} from "../../Util/commonFunction.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {setMenus} from "../../Redux/sidebarSlice.jsx";
import apiCall from "../../Axios/APIHelper.jsx";


function SideNavBar() {
    const navigate = useNavigate();
    const menus = useSelector((state) => state.sidebar.menus);
    const dispatch = useDispatch();
    // Initialize open menus from localStorage
    const [openMenus, setOpenMenus] = useState(() => {
        const savedOpenMenus = localStorage.getItem('openMenus');
        return savedOpenMenus ? new Set(JSON.parse(savedOpenMenus)) : new Set();
    });
    const location = useLocation(); // Get the current path

    // Save open menus to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('openMenus', JSON.stringify(Array.from(openMenus)));
    }, [openMenus]);

    const handleMenuClick = (menu, event) => {
        event.preventDefault(); // Prevent default to avoid page reload

        if (menu.subMenus?.length > 0) {
            setOpenMenus(prev => {
                const newOpenMenus = new Set(prev);
                if (newOpenMenus.has(menu.id)) {
                    newOpenMenus.delete(menu.id);
                } else {
                    newOpenMenus.add(menu.id);
                }
                return newOpenMenus;
            });
        } else {
            navigate(menu.path);
        }
    };

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

    // Recursive menu rendering function
    const renderMenus = (menuList) => {
        return menuList.map((menu) => {
            const isActive = location.pathname === menu.path; // Check if this menu is active
            const hasSubMenus = menu.subMenus?.length > 0;
            const isOpen = openMenus.has(menu.id);
            // Check if any child menu is active
            const isChildActive = hasSubMenus && menu.subMenus.some(
                submenu => location.pathname === submenu.path
            );
            return (
                <li key={menu.id}>
                    <a onClick={(e) => handleMenuClick(menu, e)}
                       className={`
                            ${isActive || isChildActive ? "active" : ""} 
                            ${isOpen ? "subdrop" : ""}
                        `}>
                        <FontAwesomeIcon icon={menu.icon} />
                        <span className="ms-2">{menu.name}</span>
                        {hasSubMenus && <span><FontAwesomeIcon icon={faChevronRight} className="menu-arrow" /></span>}
                    </a>
                    {hasSubMenus && (
                        <ul style={{ display: isOpen ? 'block' : 'none' }}>
                            {renderMenus(menu.subMenus)}
                        </ul>
                    )}
                </li>
            )
        });
    };

    return (
        <ul>
            <li className="menu-title py-1">MAIN MENU</li>
            {renderMenus(menus)}
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
