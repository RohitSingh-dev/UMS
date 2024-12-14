import Lottie from "lottie-react";
import loading from "../../assets/Lottie/loading3.json"

const CustomLoader = () => {
    return (
        <div>
            <Lottie animationData={loading} loop={true} autoplay={true} style={{height:"250px"}} />
        </div>
    );
};

export default CustomLoader;
