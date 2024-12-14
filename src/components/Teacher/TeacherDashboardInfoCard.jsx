import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {NavLink} from "react-router-dom";

const TeacherDashboardInfoCard = ({header, footer, children, onClick}) => {
    return (
        <div className='col-xl-4 col-md-6 col-12'>
            <div className='card'>
                <div className='card-header'>
                    <div className="row align-items-center">
                        <div className='col-12 d-flex justify-content-between'>
                            <h5 className="card-text">{header}</h5>
                            <NavLink to='#' className="btn border-0" onClick={onClick}><FontAwesomeIcon icon={faEye} className="dash"/></NavLink>
                        </div>
                    </div>
                </div>
                <div className='card-body middle-text'> {children}</div>
                {
                    footer &&
                    <div className='card-footer'>{footer}</div>
                }
            </div>
        </div>
    )
}

TeacherDashboardInfoCard.propTypes = {
    header: PropTypes.string.isRequired,
    footer: PropTypes.string,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
};

export default TeacherDashboardInfoCard