import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import PropTypes from "prop-types";
import html2pdf from 'html2pdf.js';
import {useRef} from "react";


const QuestionPaperModal = ({visible, onHide, paperData, onConfirmClick}) => {
    const contentRef = useRef(null);

    const renderQuestions = (questionGroup) => {
        console.log("unsorted:", paperData)
        const sortedQuestions = [...questionGroup.questions].sort((a, b) => {
            const numA = parseFloat(a.questionSerialNumber);
            const numB = parseFloat(b.questionSerialNumber);

            // If both values are numeric, sort by number
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }

            // If only one of them is numeric, put numeric values first
            if (!isNaN(numA)) return -1;
            if (!isNaN(numB)) return 1;

            // If both are non-numeric, sort alphabetically
            return a.questionSerialNumber.localeCompare(b.questionSerialNumber, undefined, { numeric: true, sensitivity: 'base' });
        });

        console.log("sorted:", sortedQuestions)

        return sortedQuestions.map((question, index) => (
            <div key={index} className="mb-3 px-4">
                <p>{question.questionSerialNumber}. {question.question}</p>
                {question.options && (
                    <ol className="px-5">
                        {question.options.map((option, optIndex) => (
                            <li key={optIndex}><span className="me-2">{optIndex+1}.</span>{option.Option}</li>
                        ))}
                    </ol>
                )}
            </div>
        ));
    };

    const sortedGroups = [...paperData.questions].sort((a, b) => a.SNo - b.SNo);

    const handleSubmit = async () => {
        try {
            // Generate PDF
            const element = contentRef.current;
            const opt = {
                margin: 10,
                filename: 'question_paper.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            };
            const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob')
            onConfirmClick(pdfBlob);
        } catch (error) {
            console.error('Error generating or sending PDF:', error);
        }
    };

    return (
        <Dialog
            header={"Question Paper Preview"}
            visible={visible}
            onHide={onHide}
            style={{width: '80vw'}}
            modal
            className="p-fluid"
        >
            <div ref={contentRef} className="question-paper pt-5">
                <h4 className="text-center">{paperData.question_paper_header}</h4>
                <h4 className="text-center">{paperData.discipline_name}</h4>
                <h6 className="text-center d-flex justify-content-center gap-5">
                    <div>Course ID : {paperData.course_id}</div>
                    <div>Course Code : {paperData.course_code}</div>
                </h6>
                <h6 className="text-center">Course Title : {paperData.course_title}</h6>
                <h6 className="text-center d-flex justify-content-around">
                    <div>Total Marks: {paperData.total_marks}</div>
                    <div>Time: {paperData.paper_time} minutes</div>
                </h6>

                {sortedGroups.map((group, index) => (
                    <div key={index} className="mb-5 mt-5">
                        <div className="d-flex justify-content-between">
                            <h6 className="font-weight-600">{group.SNo}. {group.header}</h6>
                            <span
                                className="pe-sm-5 bolder-text">{group.marks_per_question} x {group.answerable_questions} = {group.answerable_questions * group.marks_per_question}</span>
                        </div>
                        {renderQuestions(group)}
                    </div>
                ))}
            </div>
            <div className="p-dialog-footer p-0">
                <Button label="Close" onClick={onHide} className="p-button-text"/>
                <Button label="Submit" onClick={()=> handleSubmit()} className="p-button-text"/>
            </div>
        </Dialog>
    );
};

QuestionPaperModal.propTypes = {
    visible: PropTypes.object.isRequired,
    onHide: PropTypes.func.isRequired,
    paperData: PropTypes.array.isRequired,
    onConfirmClick: PropTypes.func.isRequired
}

export default QuestionPaperModal;