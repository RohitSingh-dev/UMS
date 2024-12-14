import PropTypes from "prop-types";
import CompareMarksPanelContainer from "./CompareMarksPanelContainer.jsx";

const CompareMarksPanel = ({teacher1_evaluation, teacher2_evaluation, sampleCompareDetails, teacher1_background, teacher2_background, fullMarks}) => {
  return (
      <div className="d-grid" style={{gridTemplateColumns: "repeat(2, 200px)"}}>
          <CompareMarksPanelContainer teacher_evaluation={teacher1_evaluation}
                                      teacher={sampleCompareDetails.teacher1}
                                      givenMarks={sampleCompareDetails.givenMarks1}
                                      background={teacher1_background} fullMarks={fullMarks} />
          <CompareMarksPanelContainer teacher_evaluation={teacher2_evaluation}
                                      teacher={sampleCompareDetails.teacher2}
                                      givenMarks={sampleCompareDetails.givenMarks2}
                                      background={teacher2_background} fullMarks={fullMarks} />
      </div>
  )
}
CompareMarksPanel.propTypes = {
    teacher1_evaluation: PropTypes.array.isRequired,
    teacher2_evaluation: PropTypes.array.isRequired,
    sampleCompareDetails: PropTypes.object.isRequired,
    teacher1_background: PropTypes.string.isRequired,
    teacher2_background:PropTypes.string.isRequired,
    fullMarks: PropTypes.number.isRequired
}
export default CompareMarksPanel