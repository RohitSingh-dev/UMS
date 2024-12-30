// ProtectedRoute.jsx
import PropTypes from "prop-types";
import {Navigate, useLocation} from "react-router-dom";
import CookieHelper from "../services/UseCookies.jsx";
import axios from "axios";
import {useEffect, useState} from "react";
import apiCall from "../Axios/APIHelper.jsx";
import {JWT_COOKIES_NAME} from "./AppConstant.jsx";

const ProtectedRoute = ({ children }) => {
    const [hasAccess, setHasAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const location = useLocation();


    useEffect(() => {
        const checkAccess = async () => {
            const path = location.pathname.split('?')[0];

            if (token && path) {
                const url = '/user/check-access'
                try {

                    const response = await axios.get(
                        url,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            params:{
                                path:path
                            }
                        }
                    );
                    setHasAccess(response.data.hasAccess); // true or false from backend response
                } catch (error) {
                    console.error("Error checking access:", error);
                    setHasAccess(false);
                }
            }
            setIsLoading(false);
        };
        checkAccess();
    }, [token, location.pathname]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (hasAccess) {
        return children;
    }

    alert("You are not authorized to access this page.");
    return <Navigate to="/" replace />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
