import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URl, // Set the base URL for your API
    timeout: 10000, // Request timeout
});


const setupInterceptors = (showLoading, hideLoading) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            if (config.showLoadingIndicator !== false) { // Default is true, only hide if explicitly false
                showLoading(); // Show loading spinner before the request
            }
            return config;
        },
        (error) => {
            hideLoading(); // Hide loading on error
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            hideLoading(); // Hide loading on success
            return response;
        },
        (error) => {
            hideLoading(); // Hide loading on error response
            return Promise.reject(error);
        }
    );
};
export { axiosInstance, setupInterceptors};

