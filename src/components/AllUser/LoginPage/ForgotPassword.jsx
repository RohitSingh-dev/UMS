import fullLogo from "../../../assets/productLogo/fullLogo.png";
import NewCaptcha from "../NewCaptcha.jsx";
import {useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {Toast} from "primereact/toast";
import {APP_FOOTER} from "../../Util/AppConstant.jsx";

function ForgotPassword({ onSubmit, onBack }) {
    const captchaRef = useRef(null);
    const [userId, setUserId] = useState("");
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const toast = useRef(null);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        const re = /^[0-9]{10}$/;
        return re.test(phone);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let isCaptchaVerified = captchaRef.current.handleCaptchaSubmit();
        if (isCaptchaVerified) {
            if (!emailOrPhone || !userId) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Invalid Credentials',
                    detail: 'Please enter your user Id and contact info.',
                    life: 3000
                });
                return;
            }

            if (!validateEmail(emailOrPhone) && !validatePhone(emailOrPhone)) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Invalid Credentials',
                    detail: 'Please enter a valid phone number or email.',
                    life: 3000
                });
                return;
            }

            const contactType = validateEmail(emailOrPhone) ? 'email' : 'phone';
            const maskedContact = contactType === 'email'
                ? emailOrPhone.replace(/(.{2})(.*)(@.*)/, '$1****$3')
                : `XXXXXX${emailOrPhone.slice(-4)}`;

            onSubmit({
                contactType,
                maskedContact
            });
        }

    };

    return (
        <>
            <header className="logo-s-view ">
                <a href="#" onClick={onBack}><i><FontAwesomeIcon icon={faChevronLeft} /></i><span className="bold m-1 ">Back</span></a>
                <img src={fullLogo} alt="Logo" />
            </header>
            <div className="auth-content">
                <div>
                    <div className='row'>
                        <div className='input-field col-md-12'>
                            <h2 className="heading1 mb-0 text-center">Forgot password</h2>
                            <p className="mb-4 text-center">Enter your contact to reset password</p>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="form-group  col-md-12">
                                <input type="text" className="form-control"
                                       aria-describedby="emailHelp"
                                       placeholder="Enter your User ID"
                                       value={userId}
                                       onChange={(e) => setUserId(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-12">
                                <input type="text" className="form-control"
                                       placeholder="Enter your Phone/Email"
                                       value={emailOrPhone}
                                       onChange={(e) => setEmailOrPhone(e.target.value)}></input>
                            </div>
                            <div className="form-group col-md-12">
                                <NewCaptcha ref={captchaRef} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-12 mt-3 text-center">
                                <Toast ref={toast}/>
                                <button type="submit" onClick={handleSubmit} className="btn btn-primary mb-3">Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="font-14px text-center bold-text">{APP_FOOTER}</p>
        </>
    );
}

ForgotPassword.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
}

export default ForgotPassword