import PropTypes from 'prop-types';
import axios from "axios";
import CookieHelper from "../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../Util/AppConstant.jsx";
import Modal from "../Util/modal.jsx";
import {useState} from "react";


const QuestionPaperCount = ({totalCount, submittedCount, id}) => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const [question, setQuestion] = useState(null);
    const [isModalOpen, setModalOpenStatus] = useState(false)
    const [questionNumber, setQuestionNumber] = useState(0)

    // Validation
    if (submittedCount > totalCount) {
        console.error('Highlight count cannot be greater than total count.');
        return null;
    }

    // Generate numbers based on totalCount
    const numbers = Array.from({length: totalCount}, (_, index) => index + 1);

    const onClickCount = (number) => {
        axios.get(`/question_bank/get-question`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                id: id,
                questionNumber: number
            }
        })
            .then(response => {
                setQuestion(response.data)
                setQuestionNumber(number)
                setModalOpenStatus(true)
            })
            .catch((ex) => {
                console.log(ex)
            });
    }

    return (
        <>
            <div className='question-paper-count'>
                {numbers.map((number) => (
                    <button
                        key={number}
                        type={"button"}
                        className={number <= submittedCount ? 'highlighted' : 'normal'}
                        onClick={number <= submittedCount ? () => onClickCount(number) : undefined}
                    >
                        {number}
                    </button>
                ))}
            </div>
            <Modal isOpen={isModalOpen} changeModalStatus={setModalOpenStatus} onRequestClose={() => {
            }} height="auto" width="1080px">
                {question === null ? <></> :
                    <>
                        <div className='card-header'>
                            <h3>Question No: <span>{questionNumber}</span></h3>
                        </div>
                        <div className='questions' style={{overflow: 'auto', maxHeight: '70vh'}}>
                            <div className='question mt-3'>
                                <p>{question.question}</p>
                            </div>
                            <div className='answer'>
                                {
                                    question.questionType !== 'MCQ'
                                        ? <p className='correct'>{question.answer}</p> :
                                        (
                                            JSON.parse(question.answer).options.map((option, index) => {
                                                const [key, value] = Object.entries(option)[0];
                                                return (
                                                    <p
                                                        key={index}
                                                        className={value === JSON.parse(question.answer).answer ? 'correct' : ''}
                                                    >
                                                        {value}
                                                    </p>
                                                );
                                            })
                                        )
                                }

                            </div>
                        </div>

                    </>
                }
            </Modal>
        </>
    );
};

// PropTypes for validation
QuestionPaperCount.propTypes = {
    totalCount: PropTypes.number.isRequired,
    submittedCount: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired
};

export default QuestionPaperCount;
