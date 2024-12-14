import LoadingAnimation from "./LodingAnimation.jsx";
import {useLoading} from "../../hooks/useLoading.jsx";

const LoadingSpinner = () => {
    const { isLoading } = useLoading();
    return isLoading ? <LoadingAnimation /> : null;
};

export default LoadingSpinner;
