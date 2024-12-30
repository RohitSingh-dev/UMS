import {useState} from "react";
import {useForm} from "react-hook-form";
import {NavLink} from "react-router-dom";
import MCQAnswerCard from "./MCQAnswerCard.jsx";
import {useDispatch, useSelector} from "react-redux";
import QuestionBankCard from "./QuestionBankCard.jsx";
import {InputTextarea} from "primereact/inputtextarea";
import {addMcqOptions, clearAllMCQs, removeMcqOptions, updateValue} from "../../Redux/mcqTypeQuestionSlice.jsx";
import PropTypes from "prop-types";
import axios from "axios";
import CookieHelper from "../../services/UseCookies.jsx";

import {JWT_COOKIES_NAME} from "../../Util/AppConstant.jsx";

const MCQTypeQuestionTemplate = ({questionPaperConfiguration, setSubmittedQuestionCount, toastRef}) => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [submitting, setSubmitting] = useState(false)


    const {
        register, handleSubmit, control, trigger,
        formState: {errors}, setValue
    } = useForm();

    const options = useSelector(state => state.mcqTypeQuestion.mcqOptions)
    const dispatch = useDispatch()

    console.log("MCQ COnfigurationb:" , questionPaperConfiguration)


    const onSubmit = (data) => {
        setSubmitting(true)
        if (data.correctAnswer === null || data.correctAnswer === undefined) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please choose a correct answer',
                life: 3000
            });
            setSubmitting(false)
            return
        }


        let formData = {
            config_id: questionPaperConfiguration.question_paper_configure_question_type_id,
            question: data.question,
            answer: data.correctAnswer,
            options: options
        }

        console.log(formData)

        axios.post("question_bank/add",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                if (res.status === 201) {
                    setIsTransitioning(true);
                    setSubmittedQuestionCount()
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
        setValue('correctAnswer', undefined)
        dispatch(clearAllMCQs())
    }


    return (
        <QuestionBankCard btnName='Save Question' onClick={handleSubmit(onSubmit)}
                          isTransitioning={isTransitioning} isButtonDisabled={submitting}>
            <div className="col-md-12">
                <div className="form-group">
                    <label>Question*</label>
                    <InputTextarea name='question'
                                   className={`w-100 ${errors.question && 'p-invalid'}`}
                                   {...register('question', {required: true})}/>
                    {errors.question && <span>This filed is required</span>}
                </div>
            </div>
            <ul className='panel panel-info mb-3 p-0'>
                {
                    options.map(
                        (
                            (option) =>
                                (
                                    <MCQAnswerCard
                                        key={option.id}
                                        control={control}
                                        register={register}
                                        errors={errors}
                                        radioName="correctAnswer"
                                        onInputChange={(e) => {
                                            dispatch(
                                                updateValue({
                                                    id: option.id,
                                                    value: e.target.value
                                                }))
                                            if (e.target.value === '') {
                                                trigger(`option_${option.id}`).then(() => {
                                                })
                                            } else {
                                                errors[`option_${option.id}`] = undefined
                                            }
                                        }}
                                        onCrossClick={() => {
                                            dispatch(removeMcqOptions(option.id))
                                            errors[`option_${option.id}`] = undefined
                                            control.unregister(`option_${option.id}`)
                                        }}
                                        isShowingCrossBtn={options.length > 2}
                                        inputName={`option_${option.id}`}
                                        value={option.id}
                                    />
                                )
                        )
                    )
                }
            </ul>
            <NavLink to="#" className="course-edit-btn w-100 mb-2 d-block"
                     onClick={() => dispatch(addMcqOptions())}>
                + Add More Options
            </NavLink>
        </QuestionBankCard>
    )
}

MCQTypeQuestionTemplate.propTypes = {
    questionPaperConfiguration: PropTypes.object.isRequired,
    setSubmittedQuestionCount: PropTypes.func.isRequired,
    toastRef: PropTypes.object.isRequired,
}

export default MCQTypeQuestionTemplate