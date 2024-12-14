import PropTypes from "prop-types";

const CompareAnswerKeyPanel = ({questionsGroups}) => {
  return (
      <div className="color-black">
          <div style={{borderBottom: "1px solid black", padding: "15px"}}>
              <strong>Question & Answer</strong>
          </div>
          <div className="mt-2 px-4">
              {questionsGroups?.map((group) =>
                  group?.questions?.map((question) => {
                      const question_id = `${question?.id}`;
                      const sl_no = `${group?.slNo}.${question?.slNo}`;
                      return (
                          <button key={question.details}
                                  className="answerkey-panel-slNo">{sl_no}</button>
                      )
                  })
              )}
          </div>
      </div>
  )
}
CompareAnswerKeyPanel.propTypes = {
    questionsGroups: PropTypes.array.isRequired
}

export default CompareAnswerKeyPanel