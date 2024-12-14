import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLongArrowAltRight} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";

const LinkButton = ({url, name}) => {
    return (
        <div className="col-xl-3 col-md-6 col-12">
            <NavLink to={url}>
                <div className="card small-card">
                    <div className="card-body middle-text">
                        <div className="d-flex justify-content-between">
                            <div className="flex-column d-flex justify-content-center">
                                <p className="m-0"><span className="font-16 bold-text">{name}</span></p>
                            </div>
                            <div className="ml-3">
                                <FontAwesomeIcon icon={faLongArrowAltRight}/>
                            </div>
                        </div>
                    </div>
                </div>
            </NavLink>
        </div>
    )
}

LinkButton.propTypes = {
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};
export default LinkButton