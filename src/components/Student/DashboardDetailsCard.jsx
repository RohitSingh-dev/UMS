import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const DashboardDetailsCard = ({
  onEyeBtnClick,
  icon,
  cardHeaderText,
  cardTitleText,
  cardSubTitleText,
  downloadBtnText,
  onClickDownloadBtn,
  cardFooterText,
}) => {
  return (
    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
      <Card>
        <Card.Header>
          <div className="row align-items-center">
            <div className="col-12 d-flex justify-content-between">
              <h5 className="card-title">{cardHeaderText}</h5>
              <button className="btn" onClick={onEyeBtnClick}>
                <i>
                  <FontAwesomeIcon icon={faEye} />
                </i>
              </button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="middle-text">
          <div className="d-flex">
            <div>
              <div className="assignmens-icon">
                <i className="color-blue">{icon}</i>
              </div>
            </div>

            <div className="flex-column d-flex justify-content-center">
              <p className="my-0 color-black bold-text ml-2 ">
                {cardTitleText}
              </p>
              {downloadBtnText && (
                <>
                  <p className="my-0 color-black bold-text ml-2">
                    {cardSubTitleText}
                  </p>
                  <NavLink
                    style={{ alignSelf: "baseline" }}
                    onClick={onClickDownloadBtn}
                  >
                    {downloadBtnText}
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </Card.Body>
        <Card.Footer>{cardFooterText}</Card.Footer>
      </Card>
    </div>
  );
};
DashboardDetailsCard.propTypes = {
  onEyeBtnClick: PropTypes.func,
  icon: PropTypes.object,
  onClickDownloadBtn: PropTypes.func,
  cardHeaderText: PropTypes.string.isRequired,
  cardFooterText: PropTypes.string.isRequired,
  cardTitleText: PropTypes.string.isRequired,
  cardSubTitleText: PropTypes.string.isRequired,
  downloadBtnText: PropTypes.string,
};

export default DashboardDetailsCard;
