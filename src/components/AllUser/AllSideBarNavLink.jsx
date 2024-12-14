import PropTypes from "prop-types";

const AllSideBarNavLink = ({ children }) => {
  return (
    <div className="sidebar" id="sidebar">
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
