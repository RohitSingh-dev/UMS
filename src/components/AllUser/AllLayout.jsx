import {NavLink} from "react-router-dom";
import fullLogo from "../../assets/productLogo/fullLogo.png";
import smallLogo from "../../assets/productLogo/smallLogo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAlignLeft} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./Search";
import HeaderUserMenu from "./HeaderUserMenu";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from 'react-redux';
import {toggleSidebar} from "../../Redux/sidebarSlice.jsx";
import {HighestRankRoleFunc} from "./Util/HighestRankRoleFunc.jsx";


const AllLayout = ({ children }) => {
  const dispatch = useDispatch();
  const sideBarClass = useSelector((state) => state.sidebar.sideBarClass);

  const toggleSubdropdown = (expand) => {
    const subdropElements = document.querySelectorAll('.subdrop + ul');
    subdropElements.forEach(element => {
      if (expand) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    });
  };

  const changeSideBarSize = () => {
    dispatch(toggleSidebar());
    {sideBarClass === 'mini-sidebar' ? toggleSubdropdown(true) : toggleSubdropdown(false)}
  };

  const highestRankRoute = HighestRankRoleFunc();

  return (
    <div className={sideBarClass}>
      <div className="main-wrapper">
        <div className="header">
          <div className="header-left">
            <NavLink to={highestRankRoute} className="logo">
              <img src={fullLogo} alt="logo" width="160" />
            </NavLink>
            <NavLink to={highestRankRoute} className="logo logo-small">
              <img src={smallLogo} alt="logo" height="50" />
            </NavLink>
          </div>
          <a href="#" id="toggle_btn" onClick={() => changeSideBarSize()}>
              <i><FontAwesomeIcon icon={faAlignLeft} /></i>
          </a>
          <SearchBar />
          <HeaderUserMenu />
        </div>
        {children}
      </div>
    </div>
  );
};

AllLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AllLayout;
