import './loginPage.css';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import CookieHelper from "../../../services/UseCookies.jsx";
import fullLogo from "../../../assets/productLogo/fullLogo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import NewCaptcha from "../NewCaptcha.jsx";
import {Toast} from "primereact/toast";
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";
import {HighestRankRoleFunc} from "../Util/HighestRankRoleFunc.jsx";
import {useDispatch} from "react-redux";
import {
    APP_FOOTER, JWT_COOKIES_NAME,
    REFRESH_TOKEN_COOKIES_NAME,
    ROLE_COOKIES_NAME,
    USERNAME_COOKIES_NAME
} from "../../../Util/AppConstant.jsx";

function LoginForm({onToggle}) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const captchaRef = useRef(null);
    const toast = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        document.addEventListener("keypress", handleKeyPress);

        return () => {
            document.removeEventListener("keypress", handleKeyPress);
        };
    });

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            requestForLogin();
        }
    };

    function requestForLogin() {
        let isCaptchaVerified = captchaRef.current.handleCaptchaSubmit();
        if (isCaptchaVerified) {
            const data = {
                username: userName,
                password: password,
            };
            const url = "auth/login";
            axios
                .post(url, data,
                    {
                        headers: {
                            "X-api-key": "tezt"
                        }
                    })
                .then((res) => loginAndSaveTheData(res))
                .catch((ex) => {
                    console.log(ex);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Invalid Credentials',
                        detail: 'Please check username and password',
                        life: 3000
                    });
                });
        }
    }

    function loginAndSaveTheData(res) {
        console.log(res.data)
        if (res.status === 200) {
            CookieHelper.setCookies(res.data.refreshToken, REFRESH_TOKEN_COOKIES_NAME);
            CookieHelper.setCookies(res.data.token, JWT_COOKIES_NAME);
            CookieHelper.setCookies(JSON.stringify(res.data.role), ROLE_COOKIES_NAME);
            CookieHelper.setCookies(res.data.fullName, USERNAME_COOKIES_NAME);
            // saveBrandingColor();
            const highestRankRoute = HighestRankRoleFunc();
            console.log(highestRankRoute)
            navigate(highestRankRoute);
        }
    }


    function saveBrandingColor() {
        console.log("Saving Branding Colors");
        axios.get("branding/user",
            {
                headers: {
                    Authorization: `Bearer ${CookieHelper.getCookie(JWT_COOKIES_NAME)}`,
                }
            }).then((res) => {
            if (res.status === 200) {
                document.documentElement.style.setProperty('--primary_color', res.data.primaryColor);
                document.documentElement.style.setProperty('--secondary_color', res.data.secondaryColor);
                document.documentElement.style.setProperty('--main_bg_color', res.data.mainBgColor);
                document.documentElement.style.setProperty('--sidebar_bg', res.data.sidebarBgColor);
                document.documentElement.style.setProperty('--sidebar_font', res.data.sidebarFontColor);
            }
        }).catch((ex) => {
            console.log(ex);
            toast.current.show({
                severity: 'error',
                summary: 'Error setting colors',
                detail: 'Some Error occurred',
                life: 3000
            });
        });
        console.log("Saved Branding Colors");
    }

    function handleTogglePassword() {
        setShowPassword(!showPassword);
    }

    return (
        <>
            <header className="logo-s-view "><img src={fullLogo} alt="Logo"/></header>
            <div className="auth-content">
                <div>
                    <div className='row'>
                        <div className='input-field col-md-12'>
                            <h2 className="heading1 mb-4 text-center">Login to continue</h2>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="form-group  col-md-12">
                                <input type="text" className="form-control"
                                       aria-describedby="emailHelp"
                                       placeholder="User ID" value={userName}
                                       onChange={(e) => setUserName(e.target.value)}></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-12">
                                <div className="position-relative">
                                    <input className="form-control"
                                           placeholder="Password"
                                           type={showPassword ? "text" : "password"} value={password}
                                           onChange={(e) => setPassword(e.target.value)}></input>
                                    <button
                                        className="auth-content-eye-btn btn"
                                        onClick={() => handleTogglePassword()}
                                        tabIndex="-1">
                                        <i>
                                            <FontAwesomeIcon
                                                icon={showPassword ? faEye : faEyeSlash}
                                            />
                                        </i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="form-group col-md-12 px-0">
                            <NewCaptcha ref={captchaRef}/>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-12 mt-3 text-center">
                                <Toast ref={toast}/>
                                <Button className="btn btn-primary mb-3"
                                        type="submit"
                                        onClick={() => requestForLogin()}>
                                    Login
                                </Button>
                                <a className="bold-text" href="#" onClick={onToggle}>Forgot password?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="font-14px text-center bold-text">{APP_FOOTER}</p>
        </>
    );
}

LoginForm.propTypes = {
    onToggle: PropTypes.func.isRequired
}

export default LoginForm