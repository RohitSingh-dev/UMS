import fullLogo from "../../assets/productLogo/fullLogo.png";
import "../../App.css";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import CookieHelper from "../../services/UseCookies.jsx";
import {
    JWT_COOKIES_NAME, JWT_REFRESH_COOKIES_NAME, REFRESH_TOKEN_COOKIES_NAME,
    ROLE_ADMIN,
    ROLE_BOS,
    ROLE_COOKIES_NAME,
    ROLE_STUDENT,
    ROLE_TEACHER,
    USERNAME_COOKIES_NAME,
} from "../Util/AppConstant";
import Captcha from "./Captcha";
import {NavLink, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, faLock, faUser,} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import {Toast} from 'primereact/toast';

function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const chaptchaRef = useRef(null);
    const toast = useRef(null);
    const navigate = useNavigate();

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
        let isCaptchaVerified = chaptchaRef.current.handleCaptchaSubmit();
        if (isCaptchaVerified) {
            const data = {
                username: userName,
                password: password,
            };
            const url = "auth/login";
            axios
                .post(url, data)
                .then((res) => loginAndSaveTheData(res))
                .catch((ex) => {console.log(ex); toast.current.show({severity:'error', summary: 'Invalid Credentials', detail:'Please check username and password', life: 3000});});
        }
    }

    function loginAndSaveTheData(res) {
        if (res.status === 200) {
            CookieHelper.setCookies(res.data.refreshToken, REFRESH_TOKEN_COOKIES_NAME);
            CookieHelper.setCookies(res.data.token, JWT_COOKIES_NAME);
            CookieHelper.setCookies(JSON.stringify(res.data.roles), ROLE_COOKIES_NAME);
            CookieHelper.setCookies(res.data.username, USERNAME_COOKIES_NAME);
            const highestRankRole = res.data.roles.reduce((prev, current) => {
                return (prev.rank > current.rank) ? prev : current;
            });
            switch (highestRankRole.authority) {
                case ROLE_STUDENT.toString():
                    navigate("/student/dashboard");
                    break;
                case ROLE_ADMIN.toString():
                    navigate("/admin/dashboard");
                    break;
                case ROLE_TEACHER.toString():
                    navigate("/teacher/dashboard");
                    break;
                case ROLE_BOS.toString():
                    navigate("/bos/dashboard");
                    break;
                default:
                    navigate("/");
                    break;
            }
        }
    }

    function handleTogglePassword() {
        setShowPassword(!showPassword);
    }

    return (
        <div className="main-wrapper login-body">
            <div className="login-wrapper">
                <div className="container">
                    <div className="loginbox">
                        <div className="login-right">
                            <div className="login-right-wrap">
                                <NavLink className="logo" href="#">
                                    <img src={fullLogo} alt="Logo"/>
                                </NavLink>
                                <h1 className="font-22 mt-5 text=left mb-4">
                                    {" "}
                                    Welcome Back!
                                </h1>
                                <div className="form-group">
                                    <div className="input-area">
                                        <i>
                                            <FontAwesomeIcon icon={faUser}/>
                                        </i>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="User Id"
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-0">
                                    <div className="input-area">
                                        <i>
                                            <FontAwesomeIcon icon={faLock}/>
                                        </i>
                                        <input
                                            className="form-control pwd"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                        />
                                        <span className="input-group-btn">
                                                  <button
                                                      className="btn btn-reveal reveal p-0 m-0 bg-transparent"
                                                      onClick={() => handleTogglePassword()}
                                                  >
                                                    <i>
                                                      <FontAwesomeIcon
                                                          icon={showPassword ? faEye : faEyeSlash}
                                                      />
                                                    </i>
                                                  </button>
                                        </span>
                                    </div>
                                </div>
                                <div className="text-end forgotpass">
                                    <a href="forgot-password.html">Forgot Password?</a>
                                </div>
                                <Captcha ref={chaptchaRef}/>
                                <div className="form-group">
                                    <Toast ref={toast} />
                                    <Button
                                        className="btn btn-primary btn-block w-100"
                                        type="submit"
                                        onClick={() => requestForLogin()}
                                    >
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="login-left">
                            <p className="m-0 font-40 thin-text">STUDY</p>
                            <p className="m-0 font-18 bolder-text">ANYTIME ANYWHERE</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Login;
