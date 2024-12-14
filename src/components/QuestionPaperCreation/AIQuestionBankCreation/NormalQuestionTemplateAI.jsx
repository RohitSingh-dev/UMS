import {useForm} from "react-hook-form";
import {InputTextarea} from "primereact/inputtextarea";
import QuestionBankCard from "../QuestionBankCard.jsx";
import PropTypes from "prop-types";
import axios from "axios";
import CookieHelper from "../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../Util/AppConstant.jsx";
import {useEffect, useState} from "react";

const NormalQuestionTemplateAI = ({question=null, toastRef}) => {
    const {register, handleSubmit, formState: {errors}, setValue} = useForm();
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [submitting, setSubmitting] = useState(false)

    const onSubmit = (data) => {
        setSubmitting(true)
        data['question_type'] = "Normal Question"
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
    }

    useEffect(()=> {
        if(question !== null){
            setValue("question", question.question)
            setValue("answer", question.correct_answer)
        }
    }, [question]);

    return (

        <QuestionBankCard btnName='Save Question' onClick={handleSubmit(onSubmit)}
                          isTransitioning={isTransitioning}
                          isButtonDisabled={submitting}
        >
            <div className="col-md-12">
                <div className="form-group">
                    <label>Question*</label>
                    <InputTextarea name='question'
                                   className={`w-100 ${errors.question && 'p-invalid'}`}
                                   {...register('question', {required: true})} />
                    {errors.question && <span>This field is required</span>}
                </div>
            </div>

            <div className="col-md-12">
                <div className="form-group">
                    <label>Answer*</label>
                    <InputTextarea name='answer'
                                   className={`w-100 ${errors.answer && 'p-invalid'}`}
                                   {...register('answer', {required: true})} />
                    {errors.answer && <span>This field is required</span>}
                </div>
            </div>
        </QuestionBankCard>
    );
};

NormalQuestionTemplateAI.propTypes = {
    toastRef: PropTypes.object.isRequired,
    question: PropTypes.object
}

export default NormalQuestionTemplateAI;
