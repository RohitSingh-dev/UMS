import PropTypes from "prop-types";
import {setSidebarClass} from "../../Redux/sidebarSlice.jsx";
import {useDispatch, useSelector} from "react-redux";

const AllSideBarNavLink = ({ children }) => {
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

    const handleMouseEnter = () => {
        if (sideBarClass === "mini-sidebar" && document.getElementById('toggle_btn')?.offsetParent !== null) {
            dispatch(setSidebarClass("mini-sidebar expand-menu"));
            toggleSubdropdown(true);
        }
    };

    const handleMouseLeave = () => {
        if (sideBarClass === "mini-sidebar expand-menu" && document.getElementById('toggle_btn')?.offsetParent !== null) {
            dispatch(setSidebarClass("mini-sidebar"));
            toggleSubdropdown(false);
        }
    };

  return (
    <div className="sidebar" id="sidebar" onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}>
      <div className="simScrollDiv">
        <div className="sidebar-inner slimscroll">
          <div className="sidebar-menu">{children}</div>
        </div>
      </div>
    </div>
  );
};

AllSideBarNavLink.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AllSideBarNavLink;
