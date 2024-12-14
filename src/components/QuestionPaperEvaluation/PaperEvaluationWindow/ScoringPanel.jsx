import {Button, InputText, Toast, useRef} from "./PopUpAnnoationImports.jsx";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

const ScoringPanel = ({
                          totalQuestions, pending, totalMarks, fullMarks,
                          questionsGroups, register, errors, handleButtonClick,
                          disabledInputs, onMarksPut, showError, setError
                      ,
                          togglePanel, setQuestionId, setFieldName}) => {

    const toast = useRef(null);

    const getQuestionDetails = (question_id, sl_no) => {
        setQuestionId(question_id)
        setFieldName(sl_no)
        togglePanel("answerKey")
    }



    return (
        <form style={{height: "100%"}}>
            <Toast ref={toast}/>
            <div className="t-ques">
                <div className="d-flex justify-content-between">
                    <h6 className="d-flex flex-column color-black">
                        <strong>Total Question {totalQuestions}</strong>
                        <small>Evaluated {totalQuestions - pending}</small>
                    </h6>
                    <h6 className="text-right color-black">
                        <strong>Mark {totalMarks}/{fullMarks}</strong>
                    </h6>
                </div>
            </div>
            <div className="ques_wrapper style-2">
                {questionsGroups?.map((group) =>
                    group?.questions?.map((question) => {
                        const fieldName = `${question?.id}`;
                        const sl_no = `${group?.slNo}.${question?.slNo}`;
                const isDisabled = disabledInputs[fieldName] || false;
                        return (
                            <div key={question.details} className="ques_box">
                                <span className="color-black quest-sl-no">{sl_no}</span>
                                <div className="p-inputgroup flex-1 annotation-input px-2">
                                    <Button
                                        className={`annotation-valid-btn ${isDisabled ? 'btn-danger' : 'btn-success'}`}
                                        onClick={() => handleButtonClick(fieldName)} tabIndex="-1"/>
                                    <InputText
                                        type="text"
                                        className={`marksInput ${errors[fieldName] ? 'annotation-input-invalid' : ''}`}
                                        name={fieldName}
                                        data-question-id={question?.id}
                                        disabled={isDisabled}
                                        {...register(fieldName, {
                                            required: true,
                                            maxLength: 4,
                                            onBlur: () => {
                                                onMarksPut()
                                            },
                                            validate: (value) => {
                                                const regex = /^(\d{1,2})(\.\d)?$/;
                                                if (!regex.test(value)) {
                                                    return "Invalid format. Use up to 2 digits with optional 1 decimal place.";
                                                }
                                                const numValue = parseFloat(value);
                                                if (numValue > question.fullMarks) {
                                                    showError(`For question no ${group?.slNo}.${question?.slNo} obtain marks must be less than or equal to ${question.fullMarks}`);
                                                    setError(fieldName, {
                                                        type: 'manual',
                                                        message: `For question no ${group?.slNo}.${question?.slNo} obtain marks must be less than or equal to ${question.fullMarks}`
                                                    });
                                                    return false;
                                                }
                                                return true;
                                            }
                                        })}
                                        onKeyDown={(e) => {
                                            const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
                                            if (allowedKeys.includes(e.key)) {
                                                if (e.key === '.') {
                                                    const currentValue = e.target.value;
                                                    if (currentValue.includes('.') || currentValue.length === 0) {
                                                        e.preventDefault();
                                                    }
                                                } else if (!['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(e.key)) {
                                                    const newValue = e.target.value + e.key;
                                                    const [integerPart, decimalPart] = newValue.split('.');
                                                    if (integerPart.length > 2 || (decimalPart && decimalPart.length > 1)) {
                                                        e.preventDefault();
                                                    }
                                                }
                                            } else {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <span className="p-inputgroup-addon">/{question.fullMarks}</span>
                                </div>
                                <FontAwesomeIcon icon={faInfoCircle} title="Show Answer" className="pe-2 scoringPanel-answerBtn"
                                                 onClick={() => getQuestionDetails(question?.id, sl_no)}/>
                            </div>
                        )
                    })
                )}
            </div>
        </form>
    )
}
ScoringPanel.propTypes = {
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
    togglePanel: PropTypes.func.isRequired,
    setQuestionId: PropTypes.func.isRequired,
    setFieldName: PropTypes.func.isRequired
}
export default ScoringPanel