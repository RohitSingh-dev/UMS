import PropTypes from "prop-types";

const UserDetailsCardContent = ({ header, value }) => {
  return (
    <p className="m-0 font-14">
      <span className="mr-3 bold-text">{header}:</span>
      <span>{value}</span>
    </p>
  );
};

UserDetailsCardContent.propTypes = {
  header: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default UserDetailsCardContent;
