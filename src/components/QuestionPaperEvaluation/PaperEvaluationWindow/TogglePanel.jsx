import {Card} from "./PopUpAnnoationImports.jsx";
import AnswerKeyPanel from "./AnswerKeyPanel.jsx";
import ScoringPanel from "./ScoringPanel.jsx";
import PropTypes from "prop-types";
import DownloadPanel from "./DownloadPanel.jsx";
import {useState} from "react";
import InstructionPanel from "./InstructionPanel.jsx";

const TogglePanel = ({
                         activePanel,
                         totalQuestions,
                         pending,
                         totalMarks,
                         fullMarks,
                         questionsGroups,
                         register,
                         errors,
                         handleButtonClick,
                         disabledInputs,
                         onMarksPut,
                         showError,
                         setError,
                         questionPaper
                     , togglePanel}) => {

    const [questionId, setQuestionId] = useState("");
    const [fieldName, setFieldName] = useState("");
    return (
        <Card className="annotation-panel-container p-0">
            <Card.Body style={{height: "calc(100vh - 82px)", width: "412px", overflowX: "hidden"}}>
                {activePanel === 'scoring' && (
                    <ScoringPanel
                        totalQuestions={totalQuestions}
                        pending={pending}
                        totalMarks={totalMarks}
                        fullMarks={fullMarks}
                        questionsGroups={questionsGroups}
                        register={register}
                        errors={errors}
                        handleButtonClick={handleButtonClick}
                        disabledInputs={disabledInputs}
                        onMarksPut={onMarksPut}
                        showError={showError}
                        setError={setError}
                       togglePanel={togglePanel}
                        setQuestionId={setQuestionId}
                        setFieldName={setFieldName}/>
                )}
                {activePanel === 'answerKey' && <AnswerKeyPanel questionsGroups={questionsGroups} questionId={questionId} fieldName={fieldName} />}
                {activePanel === 'download' && <DownloadPanel questionPaper={questionPaper}/>}
                {activePanel === 'instruction' && <InstructionPanel/>}
            </Card.Body>
        </Card>
    )
};
TogglePanel.propTypes = {
    activePanel: PropTypes.string.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    pending: PropTypes.number.isRequired,
    totalMarks: PropTypes.number.isRequired,
    fullMarks: PropTypes.number.isRequired,
    questionsGroups: PropTypes.array.isRequired,
    register: PropTypes.any.isRequired,
    errors: PropTypes.any.isRequired,
    handleButtonClick: PropTypes.func.isRequired,
    disabledInputs: PropTypes.object.isRequired,
    onMarksPut: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    questionPaper: PropTypes.string.isRequired,
    togglePanel: PropTypes.func.isRequired
}

export default TogglePanel