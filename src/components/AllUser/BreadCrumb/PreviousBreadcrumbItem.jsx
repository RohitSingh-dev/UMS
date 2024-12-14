import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";

const PreviousBreadcrumbItem = ({name, url}) => {
    return (
        <li className="breadcrumb-item">
            <NavLink to={url}>{name}</NavLink>
        </li>
    )
}

PreviousBreadcrumbItem.propTypes = {
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};
export default PreviousBreadcrumbItem