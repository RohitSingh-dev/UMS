import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const GrievanceFile=({name, icon, link, color})=>{
  return (
    <li>
      <NavLink className="color-defalt" to={link}> <span><FontAwesomeIcon icon={icon} className={color} />{name}</span></NavLink>
    </li>
  );
}

GrievanceFile.propTypes = {
  name : PropTypes.string,
  icon : PropTypes.string,
  link : PropTypes.string,
  color: PropTypes.string, 
}

export default GrievanceFile;