import PropTypes from "prop-types";
import { BreadCrumb } from "primereact/breadcrumb";
import { NavLink } from "react-router-dom";

const CustomBreadCrumb = ({ items, dashboardLink }) => {
  let breadcrumb = [];
  items.forEach((item, index) => {
    let c = "p-menuitem-text text-black";
    if (index == items.length - 1) {
      c = "active-breadcrumb font-semibold";
    }
    let v = {
      label: item.name,
      template: () => (
        <NavLink to={item.link} className="p-menuitem-link">
          <a className={c}>{item.name}</a>
        </NavLink>
      ),
    };
    breadcrumb.push(v);
  });

  const home = {
    template: () => (
      <NavLink to={dashboardLink} className="p-menuitem-link">
        <i className="pi pi-home text-black"></i>
      </NavLink>
    ),
  };

  return <BreadCrumb model={breadcrumb} home={home} />;
};

CustomBreadCrumb.propTypes = {
  dashboardLink: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
};

export default CustomBreadCrumb;
