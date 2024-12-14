import {NavLink} from "react-router-dom";
import {InputTextarea} from "primereact/inputtextarea";
import PropTypes from "prop-types";
import {Controller} from "react-hook-form";
import {RadioButton} from "primereact/radiobutton";

const MCQAnswerCard = ({
                           control,
                           register,
                           errors,
                           radioName,
                           inputName,
                           value,
                           onInputChange,
                           onCrossClick,
                           isShowingCrossBtn,
                       }) => {

    const isChecked = (field) => {
        return field.value === value
    }

    return (
        <div className="question-drag panel-heading d-flex w-100 ui-sortable-handle mb-3">
            <div className="py-2 pe-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="19" viewBox="0 0 16 19" fill="none">
                    <line x1="1" y1="1.0946" x2="15" y2="1.0946" stroke="#3743BE" strokeWidth="2"
                          strokeLinecap="round"></line>
                    <line x1="1" y1="9.10132" x2="15" y2="9.10132" stroke="#3743BE" strokeWidth="2"
                          strokeLinecap="round"></line>
                    <line x1="1" y1="17.1082" x2="15" y2="17.1082" stroke="#3743BE" strokeWidth="2"
                          strokeLinecap="round"></line>
                </svg>
            </div>
            <div className="w-100">
                <div className="row">
                    <div className="col">
                        <InputTextarea className={`w-100 form-control ${errors[`${inputName}`] && 'p-invalid'}`}
                                       name={inputName}
                                       {...register(`${inputName}`, {
                                           required: true,
                                           onChange: (e) => {
                                               onInputChange(e);  // Call the custom onInputChange function
                                           }
                                       })}
                        ></InputTextarea>
                        {errors[`${inputName}`] && <span>This filed is required</span>}
                        <p className="color-gray mt-3 mb-0 font-16 d-flex align-items-center">
                            <Controller
                                name={radioName}
                                control={control}
                                defaultValue={null}
                                render={({field}) => (
                                    <RadioButton
                                        inputId={`${radioName}-${value}`}
                                        value={value}
                                        checked={isChecked(field)}
                                        onChange={(e) => field.onChange(e.value)}
                                    />
                                )}
                            />
                            <label className="my-1 mx-2 bold-text" htmlFor="flexCheckDefault11">Correct Answer</label>
                        </p>
                    </div>
                </div>
            </div>
            <div className="py-2 ps-2">
                {isShowingCrossBtn && (
                    <div className="col-n d-flex">
                        <NavLink className="mx-2" to="#" onClick={onCrossClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"
                                 fill="none">
                                <circle cx="10.5" cy="10.5" r="10.5" fill="#54575F" fillOpacity="0.1"></circle>
                                <path opacity="0.5" d="M7.73828 7.7373L13.8172 13.8163M13.8172 7.7373L7.73828 13.8163"
                                      stroke="#54575F" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"></path>
                            </svg>
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    )

}

MCQAnswerCard.propTypes = {
    control: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    radioName: PropTypes.string.isRequired,
    inputName: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onCrossClick: PropTypes.func.isRequired,
    isShowingCrossBtn: PropTypes.bool.isRequired
};

export default MCQAnswerCard