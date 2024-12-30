// LoadingContext.js
import { createContext, useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

// Create the LoadingContext
const LoadingContext = createContext({
    isLoading: false,
    showLoading: () => {},
    hideLoading: () => {},
});

// Provider component
export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = () => {
        setIsLoading(true); // This triggers a re-render
    };

    const hideLoading = () => {
        setIsLoading(false); // This triggers a re-render
    };

    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
            <LoadingSpinner />
            {children}
        </LoadingContext.Provider>
    );
};

// Export LoadingContext for access
export default LoadingContext ;
