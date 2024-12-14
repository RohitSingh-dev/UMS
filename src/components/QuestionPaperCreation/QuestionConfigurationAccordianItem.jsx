import PropTypes from "prop-types";
import {useState} from "react";

const QuestionConfigurationAccordionItem = ({sectionName, questionType, children, index}) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="accordion-item" key={index}>
            <button
                className="accordion-title w-100 border-0"
                onClick={() => toggleAccordion(index)}>
                <h5>{sectionName} <span>({questionType})</span></h5>
                <span>{activeIndex === index ? "-" : "+"}</span>
            </button>
            {activeIndex === index && <div className="accordion-content">{children}</div>}
        </div>
    )
}
QuestionConfigurationAccordionItem.propTypes = {
    children: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
    questionType: PropTypes.string.isRequired,
    sectionName: PropTypes.string.isRequired,
};
export default QuestionConfigurationAccordionItem