import './loginPage.css';
import whiteLogo from "../../../assets/productLogo/logo-white-text.png";
import LoginForm from "./LoginForm.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import {useEffect, useRef, useState} from "react";
import OtpVerification from "./OtpVerification.jsx";

function LoginPage() {
    const [view, setView] = useState("login");
    const [contactInfo, setContactInfo] = useState({
        contactType: '',
        maskedContact: ''
    });
    const containerRef = useRef(null);

    const showLoginForm = () => {
        setView("login");
    };

    const showForgotPassword = () => {
        setView("forgotPassword");
    };

    const handleForgotPasswordSubmit = (info) => {
        setContactInfo(info);
        setView("otp");
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [view]);

    return (
        <div className="loginPage">
            <div className="main-contain">
                <section className="auth-sidebar">
                    <div className="auth-sidebar-content p-4">
                        <div>
                            <header className="logo"><img src={whiteLogo} alt="Logo"/></header>
                            <div className="artwork">
                                <p className="text-white font-24px mb-4">Welcome &#95;</p>

                                <p className="text-white font-36px thin-text m-0">Simplifying Education for a<br/> <span
                                    className="bolder-text">Smarter Tomorrow</span></p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content" ref={containerRef}>
                    {view === "login" && <LoginForm onToggle={showForgotPassword} />}
                    {view === "forgotPassword" && (
                        <ForgotPassword
                            onSubmit={handleForgotPasswordSubmit}
                            onBack={showLoginForm}
                        />
                    )}
                    {view === "otp" && (
                        <OtpVerification
                            onBack={showForgotPassword}
                            contactType={contactInfo.contactType}
                            maskedContact={contactInfo.maskedContact}
                        />
                    )}
                </section>
            </div>
        </div>
    );
}

export default LoginPage