// src/services/authService.js
import axios from 'axios';
import CookieHelper from "./UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../components/Util/AppConstant.jsx";

export const fetchNewToken = async () => {
    try {
        const response = await axios.post('/auth/refresh',
            {refresh_token: ''}
        );
        const newToken = response.data.access_token;
        CookieHelper.setCookies(newToken, JWT_COOKIES_NAME);
        return newToken;
    } catch (error) {
        console.error('Error fetching new token', error);
        throw new Error('Unable to refresh token');
    }
};
