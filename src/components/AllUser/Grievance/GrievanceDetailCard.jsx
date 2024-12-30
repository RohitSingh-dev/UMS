import PropTypes from "prop-types";

const GrievanceDetailCard = ({ children, name, icon, date, description }) => {
  return (
    <div className="card">
      <div className="d-flex justify-content-between mb-1">
        <h6>
          <span className="user-img rounded-circle">
            <img src={icon} alt={`Profile picture of ${name}`} />
          </span>
          <span>{name}</span>
        </h6>
        <span>{date}</span>
      </div>
      <p className="m-0">{description}</p>
      {children}
    </div>
  );
};

GrievanceDetailCard.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default GrievanceDetailCard;
