import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightLong} from "@fortawesome/free-solid-svg-icons";

const DownloadPanel = ({questionPaper}) => {
  return (
      <div className="h-100 color-black download-panel">
          <div>
              <div style={{borderBottom: "1px solid black", padding: "15px"}}>
                  <strong>Download</strong>
              </div>
          </div>
          <div className="d-flex flex-column px-4 mt-3">
              <div>
                  <FontAwesomeIcon icon={faArrowRightLong} />
                  <a download="" href={questionPaper} target="_blank" className="mx-2 bolder-text">Question Paper</a>
              </div>
              <div className="mt-1">
                  <FontAwesomeIcon icon={faArrowRightLong} />
                  <a download="" href={"#"} target="_blank" className="mx-2 bolder-text">Answer Script</a>
              </div>
              <div className="mt-1">
                  <FontAwesomeIcon icon={faArrowRightLong} />
                  <a download="" href={"#"} target="_blank" className="mx-2 bolder-text">Instruction</a>
              </div>
          </div>
      </div>
  )
}
DownloadPanel.propTypes = {
    questionPaper: PropTypes.string.isRequired
}

export default DownloadPanel