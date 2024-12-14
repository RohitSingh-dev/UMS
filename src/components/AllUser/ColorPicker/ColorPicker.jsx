import {GithubPicker} from "react-color";
import React, {useState, useRef} from "react";
import PropTypes from "prop-types";

const ColorPicker = ({pickerComponent, isPickerVisible, pickerWidth, initialColor, onColorChange, onPickerToggle}) => {
    const [pickedColor, setPickedColor] = useState(initialColor);
    const [pickerPosition, setPickerPosition] = useState({top: 0, left: 0});
    const pickerButtonRef = useRef(null);

    const handleButtonClick = (event) => {
        if (pickerButtonRef.current) {
            const rect = pickerButtonRef.current.getBoundingClientRect();
            setPickerPosition({
                top: rect.top-20,
                left: rect.left - event.clientX +50
            });
        }
        onPickerToggle(); // Toggle visibility from parent
    };

    const onChangeColor = (color) => {
        const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        setPickedColor(rgbaColor);
        onColorChange(rgbaColor);
        onPickerToggle(); // Close the picker after selecting a color
    };

    return (
        <div>
            <button
                className="color-picker-block"
                style={{background: pickedColor, border: '1px solid black'}}
                ref={pickerButtonRef}
                onClick={handleButtonClick}
            ></button>
            {
                isPickerVisible && (
                    <div style={{
                        position: "absolute",
                        top: pickerPosition.top,
                        left: pickerPosition.left,
                        zIndex: 1000,
                    }}>
                        {
                            React.cloneElement(pickerComponent, {
                                onChange: onChangeColor,
                                color: pickedColor,
                                width: `${pickerWidth}px`
                            })
                        }
                    </div>
                )
            }
        </div>
    );
};

ColorPicker.propTypes = {
    pickerComponent: PropTypes.element.isRequired,
    pickerWidth: PropTypes.number,
    initialColor: PropTypes.string,
    onColorChange: PropTypes.func,
    isPickerVisible: PropTypes.bool,
    onPickerToggle: PropTypes.func.isRequired,
};

ColorPicker.defaultProps = {
    pickerComponent: <GithubPicker />,
    pickerWidth: 230,
    initialColor: "#000000",
    isPickerVisible: false,
};

export default ColorPicker;
