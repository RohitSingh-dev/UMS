import {Card} from "../PaperEvaluationWindow/PopUpAnnoationImports.jsx";
import CompareMarksPanel from "./CompareMarksPanel.jsx";
import PropTypes from "prop-types";
import CompareAnswerKeyPanel from "./CompareAnswerKeyPanel.jsx";

const ComparePageTogglePanel = ({activePanel, sampleCompareDetails, teacher1_evaluation, teacher2_evaluation, teacher1_background, teacher2_background, fullMarks}) => {
  return (
      <Card className="annotation-panel-container p-0" style={{height: "calc(-82px + 100vh)"}}>
          <Card.Body style={{display: "flex", height: "100%", overflow: "auto"}}>
              {activePanel === 'compareMarks' && <CompareMarksPanel teacher1_evaluation={teacher1_evaluation} teacher2_evaluation={teacher2_evaluation} sampleCompareDetails={sampleCompareDetails} teacher1_background={teacher1_background} teacher2_background={teacher2_background} fullMarks={fullMarks}/> }
              {activePanel === 'answerKey' && <CompareAnswerKeyPanel questionsGroups={teacher1_evaluation}/>}
          </Card.Body>
      </Card>
  )
}
ComparePageTogglePanel.propTypes = {
    activePanel: PropTypes.string.isRequired,
    teacher1_evaluation: PropTypes.any.isRequired,
    teacher2_evaluation: PropTypes.any.isRequired,
    sampleCompareDetails: PropTypes.object.isRequired,
    teacher1_background: PropTypes.string.isRequired,
    teacher2_background:PropTypes.string.isRequired,
    fullMarks: PropTypes.number.isRequired
}

export default ComparePageTogglePanel