import {fetchNewToken} from "../services/authService.jsx";
import CookieHelper from "../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../components/Util/AppConstant.jsx";
import {axiosInstance} from "./axiosInstance.jsx";

const apiCall = async ({
                           url,
                           method = 'get',
                           params = {},
                           data = {},
                           headers = {},
                           retryOnTokenExpired = true,
                           showLoadingIndicator = true
                       }) => {

    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);

    const finalHeaders = {
        ...headers,
        "Authorization": `Bearer ${token}`,
    };

    try {
        const requestOptions = {
            url,
            method,
            headers: finalHeaders,
            showLoadingIndicator
        };

        if (Object.keys(params).length > 0) requestOptions.params = params;
        if (Object.keys(data).length > 0) requestOptions.data = data;
        if (data instanceof FormData) requestOptions.data = data

        console.log(requestOptions)

        const response = await axiosInstance(requestOptions);

        return response.data; // Resolve with the response data
    } catch (error) {
        if (retryOnTokenExpired && error.response?.status === 401 && error.response?.data === "JWT token was expired") {
            try {
                const newToken = await fetchNewToken();

                const retryResponse = await axiosInstance({
                    url,
                    method,
                    params,
                    data,
                    headers: {
                        ...finalHeaders,
                        "Authorization": `Bearer ${newToken}`,
                    },
                });

                return retryResponse.data; // Resolve with the retry response data
            } catch (retryError) {
                console.error("Retry API call failed:", retryError);
                throw retryError; // Rethrow the retry error
            }
        }

        // Handle specific error scenarios
        if (error.response) {
            console.error(`API Error [${error.response.status}]:`, error.response.data);
        } else if (error.request) {
            console.error("No response received from API:", error.request);
        } else {
            console.error("API Request Error:", error.message);
        }

        throw error; // Automatically rethrow the error after logging
    }
};

export default apiCall;
