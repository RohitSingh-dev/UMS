import PropTypes from "prop-types";

const ActiveBreadcrumbItem = ({name}) => {
    return (
        <li className="breadcrumb-item active">{name}</li>
    )
}
ActiveBreadcrumbItem.propTypes = {
    name: PropTypes.string.isRequired,
};
export default ActiveBreadcrumbItem