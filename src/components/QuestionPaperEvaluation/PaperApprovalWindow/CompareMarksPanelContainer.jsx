import {Button, InputText} from "../PaperEvaluationWindow/PopUpAnnoationImports.jsx";
import PropTypes from "prop-types";

import {NOT_ANSWERED_QUESTION_MARKS} from "../../../Util/AppConstant.jsx";

const CompareMarksPanelContainer = ({teacher_evaluation,teacher, givenMarks, background, fullMarks}) => {
  return (
      <div style={{width: "200px", padding: "10px", background: background}}>
          <div style={{color: "black", paddingLeft: "18px"}}>
              <strong>{teacher}</strong><br/>
              <strong>Marks: {givenMarks}/{fullMarks}</strong>
          </div>
          <div className="comparePanel-marksContainer">
              {teacher_evaluation?.map((group) =>
                  group?.questions?.map((question) => {
                      const value = question?.given_marks === NOT_ANSWERED_QUESTION_MARKS.toString() ? '0' :question?.given_marks;
                      const isDisabled = question?.given_marks === NOT_ANSWERED_QUESTION_MARKS.toString() || false;
                      return (
                          <div key={question.details} className="ques_box">
                              <span className="me-2 ms-3 color-black">{group?.slNo}.{question?.slNo}</span>
                              <div className="p-inputgroup flex-1 annotation-input" style={{width: "110px"}}>
                                  <Button className={`annotation-valid-btn ${isDisabled ? 'btn-danger' : 'btn-success'}`}
                                          style={{pointerEvents: "none"}}/>
                                  <InputText
                                      type="text"
                                      value={value}
                                      className="marksInput"
                                      data-question-id={question?.id}
                                      disabled={true}
                                  />
                                  <span className="p-inputgroup-addon">/{question.fullMarks}</span>
                              </div>
                          </div>
                      )
                  })
              )}
          </div>
      </div>
  )
}
CompareMarksPanelContainer.propTypes = {
    teacher_evaluation: PropTypes.array.isRequired,
    teacher: PropTypes.string.isRequired,
    givenMarks: PropTypes.number.isRequired,
    background: PropTypes.string.isRequired,
    fullMarks: PropTypes.number.isRequired
}

export default CompareMarksPanelContainer