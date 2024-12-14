import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {InputTextarea} from "primereact/inputtextarea";
import {RadioButton} from "primereact/radiobutton";
import QuestionBankCard from "../QuestionBankCard.jsx";
import PropTypes from "prop-types";
import axios from "axios";
import CookieHelper from "../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../Util/AppConstant.jsx";

const TrueFalseQuestionTemplateAI = ({question = null, toastRef}) => {
    const {register, handleSubmit, control, formState: {errors}, setValue} = useForm();
    const [selectedValue, setSelectedValue] = useState(null);
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [submitting, setSubmitting] = useState(false)

    const onSubmit = (data) => {
        setSubmitting(true)
        data['question_type'] = "TRUE_AND_FALSE"
        if (data.answer === undefined) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please choose a correct answer',
                life: 3000
            });
            setSubmitting(false)
            return;
        }
        axios.post("question_bank/add",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                if (res.status === 201) {
                    setIsTransitioning(true);
                    toastRef.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Question added successfully',
                        life: 3000
                    });
                    clearTheForm()
                    setTimeout(() => {
                        setIsTransitioning(false);
                        setSubmitting(false)
                    }, 500);
                }
            })
            .catch(() => setSubmitting(false))
    };

    const clearTheForm = () => {
        setValue('question', '')
        setValue('answer', '')
        setSelectedValue(null)
    }


    const handleDivClick = (value, onChange) => {
        setSelectedValue(value);
        onChange(value);
    };

    useEffect(() => {
        if (question !== null) {
            let ans = null
            if (question.correct_answer.toLowerCase() === 'true') {
                ans = true
            } else {
                ans = false
            }
            setValue("question", question.question)
            setValue("answer", ans)
            setSelectedValue(ans)
        }
    }, [question]);

    return (
        <QuestionBankCard btnName='Save Question' onClick={handleSubmit(onSubmit)} isTransitioning={isTransitioning}
                          isButtonDisabled={submitting}>
            <div className="col-md-12">
                <div className="form-group">
                    <label>Question*</label>
                    <InputTextarea name='question'
                                   className={`w-100 ${errors.question && 'p-invalid'}`}
                                   {...register('question', {required: true})} />
                    {errors.question && <span>This field is required</span>}
                </div>
            </div>

            {/* True Option */}
            <div className='col-md-2 p-2'>
                <Controller
                    name='answer'
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <button
                            className={`w-100 bg-white true_false_btn ${selectedValue === true ? 'selected' : ''}`}
                            onClick={() => handleDivClick(true, onChange)}
                        >
                            <RadioButton
                                inputId={`answerTrue`}
                                value={true}
                                checked={value === true}
                                onChange={(e) => onChange(e.value)}
                                className="d-none"
                            />
                            <p className="bold-text my-1">True</p>
                        </button>
                    )}
                />
            </div>

            {/* False Option */}
            <div className='col-md-2 p-2'>
                <Controller
                    name='answer'
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <button
                            className={`w-100  bg-white true_false_btn ${selectedValue === false ? 'selected' : ''}`}
                            onClick={() => handleDivClick(false, onChange)}
                        >
                            <RadioButton
                                inputId={`answerFalse`}
                                value={false}
                                checked={value === false}
                                onChange={(e) => onChange(e.value)}
                                className="d-none"
                            />
                            <p className="bold-text my-1">False</p>
                        </button>
                    )}
                />
            </div>
        </QuestionBankCard>
    );
};

TrueFalseQuestionTemplateAI.propTypes = {
    question: PropTypes.object,
    toastRef: PropTypes.object.isRequired,
}

export default TrueFalseQuestionTemplateAI;
