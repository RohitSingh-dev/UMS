import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const AddDataCard = ({children, onSave, header, isSubDataCard}) => {
  return(
      <div className='card'>
          <div className="card-header mb-3">
              <h5 className="card-title">{header}</h5>
          </div>
          {children}
          <div className={`mt-4 ${isSubDataCard? 'd-none' : ''}`}>
              <NavLink to="javascript:void(0)" className="btn btn-primary-violet" onClick={onSave}>
                  <FontAwesomeIcon icon={faSave}/> Save
              </NavLink>
          </div>
      </div>
  )
}

AddDataCard.propTypes = {
    children: PropTypes.node,
    onSave: PropTypes.func,
    header: PropTypes.string,
    isSubDataCard: PropTypes.bool
};
export default AddDataCard