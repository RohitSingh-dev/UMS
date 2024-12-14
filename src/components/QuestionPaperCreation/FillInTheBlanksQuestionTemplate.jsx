import {useRef} from "react";
import {Toast} from "primereact/toast";
import {useForm} from "react-hook-form";
import {InputTextarea} from "primereact/inputtextarea";
import {InputText} from "primereact/inputtext";
import QuestionBankCard from "./QuestionBankCard.jsx";

const FillInTheBlanksQuestionTemplate = () => {
    const {register, handleSubmit, control, formState: {errors}} = useForm();
    const toast = useRef(null);

    const onSubmit = (data) => {
        console.log(data.Question)
        console.log("Submitted data:", data);
        alert('Question Saved');
    };

    return (
        <>
            <Toast ref={toast}/>
            <QuestionBankCard btnName='Save Question' onClick={handleSubmit(onSubmit)}>
                <div>
                    <InputText name='fullMarks' placeholder='Full Marks' keyfilter='int' maxLength='2'
                               className={`${errors.fullMarks && 'p-invalid'}  float-end`}
                               {...register('fullMarks', {required: true})} />
                    {errors.fullMarks && <span className='float-end'>This field is required</span>}
                </div>
                <div className="col-md-12">
                    <div className="form-group">
                        <label>Question* <span className='text-danger'>(Please put $$ in place of the blank)</span></label>
                        <InputTextarea name='Question'
                                       className={`w-100 ${errors.Question && 'p-invalid'}`}
                                       {...register('Question', {required: true})} />
                        {errors.Question && <span>This field is required</span>}
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="form-group">
                        <label>Answer*</label>
                        <InputTextarea name='answer'
                                       className={`w-100 ${errors.Question && 'p-invalid'}`}
                                       {...register('answer', {required: true})} />
                        {errors.answer && <span>This field is required</span>}
                    </div>
                </div>
            </QuestionBankCard>
        </>
    );
};

export default FillInTheBlanksQuestionTemplate;
