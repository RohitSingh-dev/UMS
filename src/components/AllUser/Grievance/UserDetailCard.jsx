import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { subtract } from "lodash";
import { NavLink } from "react-router-dom";

const UserDetailCard = ( props ) => {
  return (
    <div className="card">
      <div className="card-body min-h-auto">
        <h5>
          Subject:
          <span className="mx-2 thin-text">{props.subject}</span>
        </h5>
        <p>
          Student:
          <span className="mx-2 thin-text">
            <NavLink className="pr-1" to="#"> <span>{props.name} <FontAwesomeIcon icon={faAngleDown} /></span></NavLink>
          </span>
        </p>
        <div className="row">
          <div className="col-md-4 mt-3">
            <label className="m-0">Registration number</label>
            <p className="m-0 color-black">{props.regNo}</p>
          </div>
          <div className="col-md-4 mt-3">
            <label className="m-0">Award</label>
            <p className="m-0 color-black">{props.award}</p>
          </div>
          <div className="col-md-4 mt-3">
            <label className="m-0">Sem</label>
            <p className="m-0 color-black">{props.sem}</p>
          </div>
          <div className="col-md-4 mt-3">
            <label className="m-0">Mobile No.</label>
            <p className="m-0 color-black">{props.mobile}</p>
          </div>
          <div className="col-md-4 mt-3">
            <label className="m-0">Email ID.</label>
            <p className="m-0 color-black">{props.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

UserDetailCard.propTypes = {
  subject: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  regNo: PropTypes.string.isRequired,
  award: PropTypes.string.isRequired,
  sem: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  mobile: PropTypes.string.isRequired,
};

export default UserDetailCard;
