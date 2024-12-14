import ColorPicker from "../../AllUser/ColorPicker/ColorPicker.jsx";
import { GithubPicker, SketchPicker } from "react-color";
import { InputNumber } from "primereact/inputnumber";
import PropTypes from "prop-types";
import { useState } from "react";

const CommentBoxEditPanel = ({ setAllAnnotation, activeCommentRef }) => {
    const allColors = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB', '#000000'];
    const [activePicker, setActivePicker] = useState(null);
    const [strokeWidth, setStrokeWidth] = useState(1);

    const updateAnnotation = (key, value) => {
        const comment = activeCommentRef.current;

        activeCommentRef.current = {
            ...comment,
            textBox: {
                ...comment.textBox,
                [key]: value,
            },
        };

        setAllAnnotation(prevState =>
            prevState.map(annotations =>
                annotations.map(annotation =>
                    annotation.id === comment.id
                        ? { ...annotation, textBox: { ...annotation.textBox, [key]: value } }
                        : annotation
                )
            )
        );
    };

    const handleColorChange = (key, color) => {
        updateAnnotation(key, color);
        setActivePicker(null);
    };

    const handleStrokeWidthChange = (event) => {
        if (event.value > 5) return;

        setStrokeWidth(event.value);
        updateAnnotation('strokeWidth', event.value);
    };

    const handlePickerToggle = (pickerName) => {
        setActivePicker(prev => (prev === pickerName ? null : pickerName));
    };

    const renderColorPicker = (label, pickerName, key, PickerComponent) => (
        <div className="d-flex gap-2 align-content-center">
            <label>{label}:</label>
            <ColorPicker
                pickerComponent={<PickerComponent colors={allColors} />}
                initialColor={`${pickerName === 'fill'? '#ffffff' : '#000000'}`}
                pickerWidth={240}
                onColorChange={(color) => handleColorChange(key, color)}
                isPickerVisible={activePicker === pickerName}
                onPickerToggle={() => handlePickerToggle(pickerName)}
            />
        </div>
    );

    return (
        <div className="m-0 p-2 edit-panel">
            <div className="d-flex gap-2 align-content-center">
                {renderColorPicker('Font', 'font', 'fontColor', GithubPicker)}
                {renderColorPicker('Fill', 'fill', 'fill', SketchPicker)}
                <div className="d-flex gap-2 align-content-center ">
                    <label>Border:</label>
                    <ColorPicker
                        pickerComponent={<SketchPicker colors={allColors} />}
                        initialColor="#000000"
                        pickerWidth={240}
                        onColorChange={(color) => handleColorChange('strokeColor', color)}
                        isPickerVisible={activePicker === 'stroke'}
                        onPickerToggle={() => handlePickerToggle('stroke')}
                    />
                    <InputNumber
                        value={strokeWidth}
                        showButtons
                        suffix="px"
                        style={{ height: "25px", width: "120px" }}
                        max={5}
                        min={0}
                        step={1}
                        className='line-weight'
                        onChange={handleStrokeWidthChange}
                        buttonLayout="horizontal"
                        decrementButtonClassName="p-button-danger compact-button"
                        incrementButtonClassName="p-button-success compact-button"
                        incrementButtonIcon="pi pi-plus"
                        decrementButtonIcon="pi pi-minus"
                    />
                </div>
            </div>
        </div>
    );
};

CommentBoxEditPanel.propTypes = {
    setAllAnnotation: PropTypes.func.isRequired,
    activeCommentRef: PropTypes.object.isRequired,
};

export default CommentBoxEditPanel;
