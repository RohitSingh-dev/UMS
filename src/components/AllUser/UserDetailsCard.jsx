import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

const UserDetailsCard = ({ children, profilePhoto, sign, userName }) => {
  return (
    <div className="col-xl-6 col-lg-12 col-md-12 col-12">
      <Card className="profile-header middle-text">
        <div className="row align-items-center">
          <div className="col-auto profile-image position-relative">
            {profilePhoto && (
              <div>
                <img
                  className="rounded-top"
                  alt="User Image"
                  src={profilePhoto}
                />
              </div>
            )}
            {sign && (
              <img className="rounded-bottom" alt="User Image" src={sign} />
            )}
          </div>
          <div className="col ml-md-n2 profile-user-info mt-3 text-white">
            <div className="row">
              <div className="col-md-12">
                <h4 className="user-name mb-0">{userName}</h4>
                {children}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

UserDetailsCard.propTypes = {
  children: PropTypes.node,
  userName: PropTypes.string.isRequired,
  profilePhoto: PropTypes.string,
  sign: PropTypes.string,
};

export default UserDetailsCard;
