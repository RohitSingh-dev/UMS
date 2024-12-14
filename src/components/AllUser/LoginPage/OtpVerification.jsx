// noinspection JSValidateTypes

import {useEffect, useRef, useState} from "react";
import fullLogo from "../../../assets/productLogo/fullLogo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {Toast} from "primereact/toast";
import {InputOtp} from 'primereact/inputotp';
import {APP_FOOTER} from "../../Util/AppConstant.jsx";

function OtpVerification({ onBack, contactType, maskedContact }) {
    const [timer, setTimer] = useState(5);
    const [isLinkDisabled, setIsLinkDisabled] = useState(true);
    const toast = useRef(null);
    const [token, setTokens] = useState();

    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(intervalId);
        } else {
            setIsLinkDisabled(false);
        }
    }, [timer]);

    // Function to format the timer in MM:SS
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const getVerificationMessage = () => {
        if (contactType === 'email') {
            return `A verification code has been sent to your email address ${maskedContact}`;
        } else {
            return `A text message with a six digit verification code has been sent to your phone number ${maskedContact}`;
        }
    };

    const resendOtp = () => {
        setTimer(5);
        setIsLinkDisabled(true);
        toast.current.show({severity: 'success', summary: 'OTP sent successfully', life: 3000});
    }

    return (
        <>
            <header className="logo-s-view">
                <a href="#" onClick={onBack}>
                    <i><FontAwesomeIcon icon={faChevronLeft} /></i>
                    <span className="bold m-1">Back</span>
                </a>
                <img src={fullLogo} alt="Logo" />
            </header>
            <div className="auth-content">
                <div>
                    <div className="row">
                        <div className="input-field col-md-12">
                            <h2 className="heading1 mb-0 text-center">OTP Verification</h2>
                            <p className="mb-4 text-center">{getVerificationMessage()}</p>
                        </div>
                    </div>
                    <form>
                        <div className="row">
                            <div className="form-group col-md-12 mt-0">
                                <div className="row otpVerification">
                                    <InputOtp length={6}
                                               mask integerOnly
                                               value={token}
                                               onChange={(e) => setTokens(e.value)}/>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mt-3">
                                        <Toast ref={toast}/>
                                        <a
                                            href="#"
                                            className="bold-text"
                                            style={{
                                                color: isLinkDisabled ? "gray" : "",
                                                pointerEvents: isLinkDisabled ? "none" : "auto"
                                            }}
                                            onClick={resendOtp}
                                        >
                                            Send another code
                                        </a>
                                    </div>
                                    <div className="col-md-6 mt-3 text-left text-xl-end text-lg-end text-md-end text-sm-left">
                                        <p className="bold-text m-0 js-timeout">{formatTime(timer)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-12 mt-3 text-center">
                                <button type="submit" className="btn btn-primary mb-3">Continue</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <p className="font-14px text-center bold-text">{APP_FOOTER}</p>
        </>
    );
}

OtpVerification.propTypes = {
    onBack: PropTypes.func.isRequired,
    contactType: PropTypes.oneOf(['email', 'phone']).isRequired,
    maskedContact: PropTypes.string.isRequired
};

export default OtpVerification;
