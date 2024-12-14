import {
  faFacebook,
  faGoogle,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
  return (
    <footer>
      <div className="d-block d-xl-flex d-lg-flex d-md-flex justify-content-between">
        <div className="social-media m-0 text-center text-xl-start text-lg-start text-md-start">
          <span>Follow Us:</span>
          <a className="google" href="#">
            <i>
              <FontAwesomeIcon icon={faGoogle} />
            </i>
          </a>
          <a className="linkedin" href="#">
            <i>
              <FontAwesomeIcon icon={faLinkedin} />
            </i>
          </a>
          <a className="facebook" href="#">
            <i>
              <FontAwesomeIcon icon={faFacebook} />
            </i>
          </a>
        </div>
        <div className="m-1 color-gray font-12 text-center text-xl-end text-lg-end text-md-end">
          © Copyright 2024. All Rights Reserved by EBest Solutions Pvt Ltd
        </div>
      </div>
    </footer>
  );
}

export default Footer;
