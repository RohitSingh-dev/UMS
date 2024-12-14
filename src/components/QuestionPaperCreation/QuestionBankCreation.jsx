import {useEffect, useRef, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Controller, useForm} from "react-hook-form";
import QuestionBankCard from "./QuestionBankCard.jsx";
import TeacherLayout from "../Teacher/TeacherLayout.jsx";
import MCQTypeQuestionTemplate from "./MCQTypeQuestionTemplate.jsx";
import TrueFalseQuestionTemplate from "./TrueFalseQuestionTemplate.jsx";
import NormalQuestionTemplate from "./NormalQuestionTemplate.jsx";
import {LOAD_CHAPTER, SEARCH_TEMPLATE} from "../../Util/AppConstant.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import CookiesHelper from "../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME, QuestionTypes} from "../Util/AppConstant.jsx";
import {restSelectTagOptionsSlice, setQuestionConfiguration} from "../../Redux/selectTagOptionsSlice.jsx";
import QuestionPaperCount from "./QuestionPaperCount.jsx";
import {NavLink} from "react-router-dom";
import QuestionPaperDetailButton from "./QuestionPaperDetailButton.jsx";
import apiCall from "../../Axios/APIHelper.jsx";


const QuestionBankCreation = () => {
    const token = CookiesHelper.getCookie(JWT_COOKIES_NAME);
    const [currentStep, setCurrentStep] = useState(LOAD_CHAPTER);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const questionPaperConfiguration = useSelector(state => state.selectTagOptions.questionConfiguration)
    const dispatch = useDispatch()
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const alertRef = useRef(null)
    const [questionTypes, setQuestionTypes] = useState([])
    const [currentConfig, setCurrentConfig] = useState(null)
    const [currentSubmittedQuestions, setCurrentSubmittedQuestions] = useState(0)
    const [allPapers, setAllPapers] = useState(null);

    const questionTypeComponents = {
        [QuestionTypes.MCQ]: MCQTypeQuestionTemplate,
        [QuestionTypes.TRUE_AND_FALSE]: TrueFalseQuestionTemplate,
        [QuestionTypes.FILL_IN_THE_BLANK]: NormalQuestionTemplate,
        [QuestionTypes.QUESTION_AND_ANSWERS]: NormalQuestionTemplate,

    };


    const {
        handleSubmit: handleSubmitSearchTemplate,
        control: controlSearchTemplate,
        formState: {errors: errorsSearchTemplate},
    } = useForm();

    const breadcrumbData = [
        {name: "Dashboard", url: "/teacher/dashboard"},
        {name: "Question Bank"},
    ];

    useEffect(() => {
        apiCall(
            {
                url: '/question_bank/get-papers',
                method: 'get',
                retryOnTokenExpired: true
            }
        )
            .then(response => {
                setAllPapers(response)
            })
            .catch((error) => {
                alertRef.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data,
                    life: 3000
                });
            });

    }, [])


    const handleTransition = (nextStep) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(nextStep);
            setIsTransitioning(false);
        }, 500);
    };

    const setQuestionType = (data) => {
        data.forEach(c => {
            let map = {
                value: c.question_paper_configure_question_type_id,
                name: c.section_name
            }
            setQuestionTypes(pre =>
                [map, ...pre]
            )
        })
    }


    const onSearchTemplateClick = (data) => {
        setIsButtonDisabled(true)
        let configuration = questionPaperConfiguration.find(input => input.question_paper_configure_question_type_id === data.section_name)
        axios.get('/question_bank/get-question-count', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                id: configuration.question_paper_configure_question_type_id
            }
        })
            .then(response => {
                setCurrentConfig(configuration)
                setCurrentSubmittedQuestions(parseInt(response.data))
                setIsButtonDisabled(false)
            })
            .catch((ex) => {
                console.log(ex)
                setIsButtonDisabled(false)
                alertRef.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No Question Type found',
                    life: 3000
                });
            });
    };

    const getTheCurrentQuestionTemplate = () => {
        const QuestionTemplate = questionTypeComponents[currentConfig.question_type] || NormalQuestionTemplate;
        return (
            <QuestionTemplate
                toastRef={alertRef}
                questionPaperConfiguration={currentConfig}
                setSubmittedQuestionCount={() => setCurrentSubmittedQuestions(prevState => prevState + 1)}
            />
        );
    }

    const onPaperClick = (data) => {
        const encryptedID = data.id
        if (!data.isComplete) {
            setIsButtonDisabled(true)
            setQuestionTypes([])
            axios.get('/paper_config/search-by-id', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    encryptedId: encryptedID
                }
            })
                .then(response => {
                    if (response.data.s === 1) {
                        dispatch(setQuestionConfiguration(response.data.config))
                        setQuestionType(response.data.config)
                        handleTransition(SEARCH_TEMPLATE)
                        setIsButtonDisabled(false)
                    }
                })
                .catch(error => {
                    setIsButtonDisabled(false)
                    console.error("There was an error fetching the data!", error);

                });

        }

    };


    return (
        <TeacherLayout breadcrumbItems={breadcrumbData} toastRef={alertRef}>
            <div className={`animation-container ${isTransitioning ? 'fade-exit' : 'fade-enter'} position-releative`}>
                {currentStep === LOAD_CHAPTER ?
                    (
                        <>
                            <h3 className="mb-4">Question Creation Hub: Pending and Created papers</h3>
                            {
                                allPapers?.map((data) => (

                                        <QuestionPaperDetailButton key={data.id} data={data}
                                                                   onClick={() => onPaperClick(data)}/>

                                    )
                                )
                            }
                        </>
                    ) : (
                        <>

                            <NavLink to='' onClick={() => handleTransition(LOAD_CHAPTER)} className="back_to_previous">
                                <FontAwesomeIcon icon={faArrowLeft}/> Back </NavLink>
                            <QuestionBankCard btnName="Search Template" isButtonDisabled={isButtonDisabled}
                                              onClick={handleSubmitSearchTemplate(onSearchTemplateClick)}>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Select Section Name*</label>
                                        <Controller
                                            name="section_name"
                                            rules={{
                                                validate: (value) => value !== undefined || "This field is required",
                                            }}
                                            control={controlSearchTemplate}
                                            render={({field}) => (
                                                <Dropdown
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    placeholder="-- Select --"
                                                    options={[...questionTypes].reverse()}
                                                    optionLabel="name"
                                                    optionValue="value"
                                                    className={`w-100 ${errorsSearchTemplate.section_name && "p-invalid"}`}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </QuestionBankCard>
                            {currentConfig &&
                                <>
                                    <div className="card mt-4">
                                        <div className="d-flex justify-content-between flex-md-row flex-column">
                                            <div>
                                                <p>
                                                    Section Name:&nbsp;<span>{currentConfig.section_name}</span>
                                                </p>
                                                <p>
                                                    Total questions need:&nbsp;<span>{currentConfig.total_question}</span>
                                                </p>
                                            </div>
                                            <div className='text-end'>
                                                <p>
                                                    Question Type:&nbsp;<span>{currentConfig.question_type_name}</span>
                                                </p>
                                                <p>
                                                    Per question marks:&nbsp;<span>{currentConfig.marks}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <QuestionPaperCount totalCount={currentConfig.total_question}
                                                            id={currentConfig.question_paper_configure_question_type_id}
                                                            submittedCount={currentSubmittedQuestions}/>
                                        {
                                            (currentConfig.total_question > currentSubmittedQuestions) ? <></> :
                                                <p className='allSubmitted'><FontAwesomeIcon
                                                    icon={faCircleExclamation}/>All
                                                    questions of this type have already been successfully submitted.</p>

                                        }
                                    </div>
                                    {
                                        (currentConfig.total_question > currentSubmittedQuestions) ?
                                            getTheCurrentQuestionTemplate()
                                            :
                                            <></>
                                    }
                                </>
                            }
                        </>
                    )}
            </div>
        </TeacherLayout>
    );
};

export default QuestionBankCreation;
