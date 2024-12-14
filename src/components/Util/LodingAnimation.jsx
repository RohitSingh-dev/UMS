import Lottie from "lottie-react";
import loading from "../../assets/Lottie/loading3.json";

const LoadingAnimation = () => {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            zIndex: 9999,
        }}>
            <Lottie animationData={loading} loop={true} autoplay={true} style={{ height: "200px" }} />
        </div>
    );
};

export default LoadingAnimation;
