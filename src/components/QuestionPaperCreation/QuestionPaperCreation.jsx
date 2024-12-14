import {useEffect, useRef, useState} from "react";
import QuestionBankCard from "./QuestionBankCard.jsx";
import TeacherLayout from "../Teacher/TeacherLayout.jsx";
import {LOAD_CHAPTER, SEARCH_TEMPLATE} from "../../Util/AppConstant.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import QuestionConfigurationAccordionItem from "./QuestionConfigurationAccordianItem.jsx";
import {InputText} from "primereact/inputtext";
import QuestionPaperAccordionItem from "./QuestionPaperAccordionItem.jsx";
import QuestionPaperModal from "./QuestionPaperModal.jsx";
import axios from "axios";
import CookieHelper from "../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../Util/AppConstant.jsx";
import ModeratorPaperPdfViewer from "./ModeratorPaperPdf.jsx";
import QuestionPaperDetailButton from "./QuestionPaperDetailButton.jsx";
import apiCall from "../../Axios/APIHelper.jsx";

const QuestionPaperCreation = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const [currentStep, setCurrentStep] = useState(LOAD_CHAPTER);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [groupedQuestions, setGroupedQuestions] = useState({});
    const [paperTime, setPaperTime] = useState("");
    const [duplicateWarnings, setDuplicateWarnings] = useState({});
    const [headers, setHeaders] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [submittedPaperData, setSubmittedPaperData] = useState(null);
    const [allPapers, setAllPapers] = useState(null);
    const [configurationId, setConfigurationId] = useState(null)
    const [data, setData] = useState(null)
    const [totalMarks, setTotalMarks] = useState(0)
    const [pdfLink, setPdfLink] = useState(null); // Store the PDF link
    const [isQuestionPaperPdfVisible, setIsQuestionPaperPdfVisible] = useState(false);

    useEffect(() => {
        apiCall({
            url: '/generate-question-paper/moderable-papers',
            method: 'get',
            retryOnTokenExpired: true
        })
            .then(response => {
                setAllPapers(response)
            })
            .catch((error) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data,
                    life: 3000
                });
            });


    }, [])
    const groupQuestionsByType = (data) => {
        console.log(data, "grouped")
        return data.reduce((acc, item) => {
            if (!acc[item.section_name]) {
                acc[item.section_name] = [];
            }
            acc[item.section_name].push(item);
            return acc;
        }, {});
    };

    useEffect(() => {
        if (Object.keys(groupedQuestions).length > 0 && selectedQuestions.length === 0) {
            const initialSelectedQuestions = Object.keys(groupedQuestions).map(section_name => ({
                section_name: section_name,
                questions: []
            }));
            setSelectedQuestions(initialSelectedQuestions);
        }
    }, [groupedQuestions, selectedQuestions]);

    const handleSelectionChange = (updatedSelection) => {
        setSelectedQuestions(prevSelectedQuestions =>
            prevSelectedQuestions.map(item =>
                item.section_name === updatedSelection.section_name
                    ? {...item, questions: updatedSelection.questions}
                    : item
            )
        );
    };

    const checkForDuplicatesSerialNo = (value, currentType) => {
        const duplicates = Object.entries(headers).filter(([section_name, header]) =>
            section_name !== currentType && header.SNo === value && value !== ''
        );
        return duplicates.length > 0;
    };

    const handleHeaderChange = (section_name, field, value) => {
        setHeaders(prevHeaders => ({
            ...prevHeaders,
            [section_name]: {
                ...prevHeaders[section_name],
                [field]: value
            }
        }));

        if (field === 'SNo') {
            const isDuplicate = checkForDuplicatesSerialNo(value, section_name);
            setDuplicateWarnings(prev => ({
                ...prev,
                [section_name]: isDuplicate
            }));

            if (isDuplicate) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'This S.No. is already in use. It may cause confusion in the question paper.',
                    life: 3000
                });
            }
        }
    };

    const renderHeader = (section_name) => {
        const questionGroup = selectedQuestions.find(q => q.section_name === section_name) || {questions: []};
        const questionType = groupedQuestions[section_name]?.[0];
        const maxQuestions = questionType?.no_of_required_questions || 0;
        const marks_per_question = questionType?.marks_per_question || 0;
        const answerable_questions = questionType?.answerable_questions || 0;

        return (
            <div className='row d-flex justify-content-between'>
                <div className='col-md-1'>
                    <div className="form-group">
                        <label className="h4">S.No.*</label><br/>
                        <InputText className={`w-100 h-25 ${duplicateWarnings[section_name] ? 'p-invalid' : ''}`}
                                   value={headers[section_name]?.SNo || ""}
                                   maxLength={2}
                                   onChange={(e) => handleHeaderChange(section_name, 'SNo', e.target.value)}
                        />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className="form-group">
                        <label className="h4">Header*</label><br/>
                        <InputText className="w-100 h-25" placeholder="Objective"
                                   value={headers[section_name]?.header || ""}
                                   onChange={(e) => handleHeaderChange(section_name, 'header', e.target.value)}
                        />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className="form-group">
                        <label className="h4">Additional Text</label><br/>
                        <InputText className="w-100 h-25" placeholder={section_name}
                                   value={headers[section_name]?.additional_text || ""}
                                   onChange={(e) => handleHeaderChange(section_name, 'additional_text', e.target.value)}
                        />
                    </div>
                </div>
                <div className='col-md-2'>
                    <div className="form-group">
                        <label className="h4">Questions*</label><br/>
                        <InputText className="w-100 h-25" disabled={true}
                                   value={`${questionGroup.questions.length}/${maxQuestions}`}/>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className="form-group">
                        <label className="h4">Marks(Marks x Choice)</label><br/>
                        <InputText className="w-100 h-25" disabled={true}
                                   value={`${marks_per_question} x ${answerable_questions} = ${marks_per_question * answerable_questions}`}/>
                    </div>
                </div>
            </div>
        );
    };

    const validateSNoConsistency = (items, getSnoProp) => {
        if (items.length === 0) return {valid: true};

        const firstSNo = getSnoProp(items[0]).trim();
        const isNumber = /^\d+$/.test(firstSNo);
        const isAlphabet = /^[A-Za-z]+$/.test(firstSNo);

        if (!isNumber && !isAlphabet) {
            return {
                valid: false,
                message: "First S.No. must be either all numbers or all alphabets."
            };
        }

        const expectedType = isNumber ? "number" : "alphabet";

        for (let i = 1; i < items.length; i++) {
            const sno = getSnoProp(items[i]).trim();
            if ((expectedType === "number" && !/^\d+$/.test(sno)) ||
                (expectedType === "alphabet" && !/^[A-Za-z]+$/.test(sno))) {
                return {
                    valid: false,
                    message: `All S.No. entries must be ${expectedType}s.`
                };
            }
        }

        return {valid: true};
    };

    const validateSNoGaps = (items, getSnoProp) => {
        if (items.length === 0) return {valid: true};

        const sNos = items.map(item => getSnoProp(item).trim());
        const isNumeric = /^\d+$/.test(sNos[0]);

        let sortedSNos;
        if (isNumeric) {
            sortedSNos = sNos.map(Number).sort((a, b) => a - b);
        } else {
            sortedSNos = [...sNos].sort();
        }

        // Check for gaps
        const smallest = isNumeric ? sortedSNos[0] : sortedSNos[0].charCodeAt(0);
        const largest = isNumeric ? sortedSNos[sortedSNos.length - 1] : sortedSNos[sortedSNos.length - 1].charCodeAt(0);

        for (let i = smallest; i <= largest; i++) {
            const expected = isNumeric ? i : String.fromCharCode(i);
            if (!sortedSNos.includes(expected)) {
                return {
                    valid: false,
                    message: `Gap found in S.Nos. Missing ${expected}.`
                };
            }
        }

        return {valid: true};
    };

    const onQuestionsSubmit = () => {

        // Validate paper time
        if (!paperTime.trim()) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter the Paper Time',
                life: 3000
            });
            return;
        }

        // Validate headers for each question section_name
        for (const section_name of Object.keys(groupedQuestions)) {
            const header = headers[section_name];
            if (!header.SNo.trim() || !header.header.trim()) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Please fill all header fields for ${section_name}`,
                    life: 3000
                });
                return;
            }
        }

        // Validate Header S.No. consistency
        const headerSnoValidationResult = validateSNoConsistency(
            Object.values(headers),
            header => header.SNo
        );
        if (!headerSnoValidationResult.valid) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Header ${headerSnoValidationResult.message}`,
                life: 3000
            });
            return;
        }
        // Validate Header S.No. gaps
        const headerGapValidationResult = validateSNoGaps(
            Object.values(headers),
            header => header.SNo
        );
        if (!headerGapValidationResult.valid) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Header ${headerGapValidationResult.message}`,
                life: 3000
            });
            return;
        }

        // Check for duplicate Header S.No.
        const duplicateFound = Object.values(duplicateWarnings).some(isDuplicate => isDuplicate);
        if (duplicateFound) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Duplicate S.No. found. Please ensure all S.No. values are unique.',
                life: 3000
            });
            return;
        }

        // Validate selected questions
        for (const questionGroup of selectedQuestions) {
            const requiredQuestions = groupedQuestions[questionGroup.section_name]?.[0]?.no_of_required_questions;
            if (questionGroup.questions.length !== requiredQuestions) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Please select ${requiredQuestions} ${questionGroup.section_name}(s)`,
                    life: 3000
                });
                return;
            }

            // Validate question serial numbers
            for (const question of questionGroup.questions) {
                console.log(question)
                if (!question.questionSerialNumber || !question.questionSerialNumber.trim()) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Please enter serial number for all questions in ${questionGroup.section_name}`,
                        life: 3000
                    });
                    return;
                }
            }

            // Validate Question S.No. consistency and gaps for each question section_name
            const questionSnoValidationResult = validateSNoConsistency(
                questionGroup.questions,
                question => question.questionSerialNumber
            );
            if (!questionSnoValidationResult.valid) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `${questionGroup.section_name} : ${questionSnoValidationResult.message}`,
                    life: 3000
                });
                return;
            }
            const questionGapValidationResult = validateSNoGaps(
                questionGroup.questions,
                question => question.questionSerialNumber
            );
            if (!questionGapValidationResult.valid) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `${questionGroup.section_name} questions: ${questionGapValidationResult.message}`,
                    life: 3000
                });
                return;
            }
        }

        // Check for duplicate Question S.No. within each question section_name
        for (const questionGroup of selectedQuestions) {
            const questionSerialNumbers = questionGroup.questions.map(q => q.questionSerialNumber.trim());

            const duplicateSerialNumbers = questionSerialNumbers.filter((value, index, self) =>
                value !== '' && self.indexOf(value) !== index
            );

            if (duplicateSerialNumbers.length > 0) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Duplicate Question S.No. found in ${questionGroup.section_name}. Please ensure all Question S.No. values are unique within this section_name.`,
                    life: 3000
                });
                return;
            }
        }

        const submissionData = {
            paper_time: paperTime,
            total_marks: totalMarks,
            configuration_id: configurationId,
            question_paper_header: data.question_paper_header,
            discipline_name: data.discipline_name,
            course_id: data.course_id,
            course_code: data.course_code,
            course_title: data.course_title,
            questions: selectedQuestions.map(group => {
                const questionType = groupedQuestions[group.section_name]?.[0];
                return {
                    section_name: group.section_name,
                    id: questionType?.id,
                    SNo: headers[group.section_name]?.SNo || "",
                    header: headers[group.section_name]?.header || "",
                    additional_text: headers[group.section_name]?.additional_text || "",
                    answerable_questions: questionType?.answerable_questions,
                    marks_per_question: questionType?.marks_per_question,
                    questions: group.questions.map(q => ({
                        ...q,
                        questionSerialNumber: q.questionSerialNumber || ""
                    })),
                    total_marks: group.questions.length * (questionType?.marks_per_question || 0)
                };
            })
        };

        setSubmittedPaperData(submissionData);
        setModalVisible(true);

    };

    const breadcrumbData = [
        {name: "Dashboard", url: "/teacher/dashboard"},
        {name: "Paper Maker"},
    ];

    const handleTransition = (nextStep) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(nextStep);
            setIsTransitioning(false);
        }, 500);
    };

    const onPaperClick = (data) => {
        const encryptedID = (data.id)
        if (data.completed_percentage < 100) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: "All teacher not submit the question",
                life: 3000
            });
            return
        }
        if (!data.isComplete) {
            axios.get('/generate-question-paper/questions', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id: encryptedID
                }
            })
                .then(response => {
                    console.log(response.data)
                    if (response.status === 200) {
                        setData(response.data)
                        const totalMarks = response.data.questions_data.reduce(
                            (total, item) => total + item.answerable_questions * item.marks_per_question, 0
                        );
                        setTotalMarks(totalMarks)
                        const grouped = groupQuestionsByType(response.data.questions_data);
                        console.log(grouped)
                        setGroupedQuestions(grouped);
                        const initialHeaders = Object.keys(grouped).reduce((acc, section_name) => {
                            acc[section_name] = {SNo: "", header: "", additional_text: ""};
                            return acc;
                        }, {});
                        setHeaders(initialHeaders);
                        setConfigurationId(encryptedID)
                        handleTransition(SEARCH_TEMPLATE);
                    } else {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: "Some error happen",
                            life: 3000
                        });
                    }
                })
                .catch((error) => {
                    console.log(error)
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response.data,
                        life: 3000
                    });
                });
        } else {
            axios.get('/generate-question-paper/questionPaperPdf', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id: encryptedID
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log(response.data)
                        setPdfLink(response.data)
                        setIsQuestionPaperPdfVisible(true)
                    } else {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: "Some error happen",
                            life: 3000
                        });
                    }
                })
                .catch((error) => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response.data,
                        life: 3000
                    });
                });
        }

    };

    const closeModal = () => {
        setIsQuestionPaperPdfVisible(false);
        setPdfLink(null);
    };

    const onConfirmClick = (pdfBlob) => {
        const formData = new FormData();
        formData.append('pdf', pdfBlob); // Append the PDF file (use actual file from input)
        formData.append('payload', JSON.stringify(submittedPaperData)); // Append the JSON payload as string
        axios.post("generate-question-paper/create",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Question paper created successfully',
                        life: 3000
                    });
                    const updatedPapers = allPapers.map(paper => {
                        if (paper.id === configurationId) {
                            return {...paper, isModerated: true};
                        }
                        return paper;
                    });

                    // Update the state with the new array
                    setAllPapers(updatedPapers);
                    handleTransition(LOAD_CHAPTER)
                    setSubmittedPaperData(null)
                    setModalVisible(false)
                }
            })
            .catch((error) => {
                console.log(error)
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })

    }


    const toast = useRef(null);

    return (
        <TeacherLayout breadcrumbItems={breadcrumbData} toastRef={toast}>
            <div className={`animation-container ${isTransitioning ? 'fade-exit' : 'fade-enter'}`}>
                {currentStep === LOAD_CHAPTER ? (
                    <>
                        <h3 className="mb-4">Moderation Hub: Pending and moderated papers</h3>
                        {
                            allPapers?.map((data) => (
                                    <QuestionPaperDetailButton key={data.id} data={data}
                                                               onClick={() => onPaperClick(data)}/>
                                )
                            )
                        }
                        {pdfLink && (
                            <ModeratorPaperPdfViewer
                                pdfLink={pdfLink}
                                isVisible={isQuestionPaperPdfVisible}
                                onClose={() => closeModal()}
                                header="Question Paper"/>
                        )}
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="back_to_previous"
                            onClick={() => handleTransition(LOAD_CHAPTER)}
                        />
                        <QuestionBankCard btnName='Save The Question Paper' onClick={onQuestionsSubmit}>
                            <div className="accordion-container">
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Paper Time(Min)*</label>
                                            <InputText name='paperTime'
                                                       className={`w-100 `}
                                                       required
                                                       value={paperTime} type={"number"}
                                                       onChange={(e) => setPaperTime(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Paper Total Marks*</label>
                                            <InputText name='paperTotalMarks'
                                                       className={`w-100 `}
                                                       required
                                                       value={totalMarks} disabled/>
                                        </div>
                                    </div>

                                </div>

                                <div className="accordion-list">
                                    {
                                        Object.keys(groupedQuestions).map((section_name, index) => (
                                                <QuestionConfigurationAccordionItem key={index} index={index}
                                                                                    sectionName={`${section_name}`}
                                                                                    questionType={groupedQuestions[section_name][0].type.replace(/_/g, " ")}>
                                                    <QuestionPaperAccordionItem
                                                        data={groupedQuestions[section_name]}
                                                        selectedQuestions={selectedQuestions.find(q => q.section_name === section_name) || {
                                                            section_name,
                                                            questions: []
                                                        }}
                                                        onSelectionChange={handleSelectionChange}
                                                        renderHeader={() => renderHeader(section_name)}
                                                        toastRef={toast}
                                                    />
                                                </QuestionConfigurationAccordionItem>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </QuestionBankCard>
                        {
                            submittedPaperData && (
                                <QuestionPaperModal
                                    onConfirmClick={(pdfBlob) => onConfirmClick(pdfBlob)}
                                    visible={modalVisible}
                                    onHide={() => setModalVisible(false)}
                                    paperData={submittedPaperData}
                                />
                            )
                        }
                    </>
                )
                }
            </div>
        </TeacherLayout>
    );
};

export default QuestionPaperCreation;
