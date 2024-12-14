import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const ActionButton = ({ icon, btnName, onClick }) => {
  return (
    <div className="col-xl-3 col-md-6 col-12">
      <NavLink href="#" onClick={onClick}>
        <Card className="small-card">
          <Card.Body className="middle-text">
            <div className="d-flex">
              <div className="me-3">
                <i className="fas fa-arrow-alt-circle-down">{icon}</i>
              </div>
              <div className="flex-column d-flex justify-content-center">
                <p className="m-0">
                  <span className="font-16 bold-text text-uppercase">
                    {btnName}
                  </span>
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </NavLink>
    </div>
  );
};

ActionButton.propTypes = {
  icon: PropTypes.object,
  btnName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ActionButton;
