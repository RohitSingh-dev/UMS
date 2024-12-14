import {useEffect, useRef, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Controller, useForm} from "react-hook-form";
import TeacherLayout from "../../Teacher/TeacherLayout.jsx";
import {LOAD_CHAPTER} from "../../../Util/AppConstant.jsx";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import CookiesHelper from "../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../Util/AppConstant.jsx";
import {restSelectTagOptionsSlice} from "../../../Redux/selectTagOptionsSlice.jsx";
import QuestionBankCard from "../QuestionBankCard.jsx";
import MCQTypeQuestionTemplateAI from "./MCQTypeQuestionTemplateAI.jsx";
import {InputText} from "primereact/inputtext";
import Lottie from "lottie-react";
import generatingAnimation from "../../../assets/Lottie/loading.json"
import thinking from "../../../assets/Lottie/Thinking.json"
import thinkComplete from "../../../assets/Lottie/Complete.json"
import NormalQuestionTemplateAI from "./NormalQuestionTemplateAI.jsx";
import TrueFalseQuestionTemplateAI from "./TrueFalseQuestionTemplateAI.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy} from "@fortawesome/free-solid-svg-icons";

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
    const [jobId, setJobId] = useState(null)
    const [generating, setGenerating] = useState(false)
    const [buttonDisable, setButtonDisable] = useState(false)
    const [isSubmitButtonClick, setIsSubmitButtonClick] = useState(null)
    const [allPapers, setAllPapers] = useState(null)
    const [displayedQuestions, setDisplayedQuestions] = useState([]);
    const [succssfullyGenerated, setIsSuccessfullyGenerated] = useState(false)
    const [copied,setCopied] = useState(null)


    //* Hard coded data

    const QuestionType = [
        {name: "Fill in the blank", value: 1},
        {name: "True and false", value: 2},
        {name: "Question answer", value: 3},
        {name: "MCQ", value: 0},
    ]

    const CourseCategories = [
        {name: "Post Graduate", value: 1},
        {name: "Post Secondary", value: 2}
    ]

    const Disciples = [
        {name: "Science", value: 1},
        {name: "Social Studies", value: 2},
        {name: "Mathematics", value: 3},
        {name: "Language Arts", value: 4},
        {name: "Enrichment", value: 5},
        {name: "Business Studies", value: 6}
    ]


    const questionTypeComponents = {
        [0]: MCQTypeQuestionTemplateAI,
        [2]: TrueFalseQuestionTemplateAI,
        [1]: NormalQuestionTemplateAI,
        [3]: NormalQuestionTemplateAI,

    };


    const {
        handleSubmit: handleSubmitSearchTemplate,
        register,
        control: controlSearchTemplate,
        formState: {errors: errorsSearchTemplate},
        getValues
    } = useForm();

    const breadcrumbData = [
        {name: "Dashboard", url: "/teacher/dashboard"},
        {name: "AI Questions Generator"},
    ];


    // useEffect(() => {
    //     axios.get('/question_bank/get-papers', {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         }
    //     })
    //         .then(response => {
    //             if (response.status === 200) {
    //                 setAllPapers(response.data)
    //             } else {
    //                 alertRef.current.show({
    //                     severity: 'error',
    //                     summary: 'Error',
    //                     detail: "Some error happen",
    //                     life: 3000
    //                 });
    //             }
    //         })
    //         .catch((error) => {
    //             alertRef.current.show({
    //                 severity: 'error',
    //                 summary: 'Error',
    //                 detail: error.response.data,
    //                 life: 3000
    //             });
    //         });
    //     return () => {
    //         dispatch(restSelectTagOptionsSlice())
    //         localStorage.clear("savedFormValues");
    //     };
    // }, [])


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

    useEffect(() => {
        if (jobId != null) {
            let timer = 0;
            const intervalId = setInterval(() => {
                if (timer < 6) {
                    timer++;
                    axios.get("question_bank/job",
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            params: {
                                job_id: jobId
                            }
                        })
                        .then(async (res) => {
                            if (res.status === 200) {
                                if (res.data.job_status === 'Completed') {
                                    const llm_reply = res.data.llm_reply
                                    if ((typeof llm_reply) === "string") {
                                        console.log("String", llm_reply)
                                        console.log(JSON.parse(llm_reply))
                                        return
                                    }
                                    timer = 0;
                                    clearInterval(intervalId)
                                    setJobId(null)
                                    setGenerating(false)
                                    await generateObject(llm_reply)
                                    setIsSuccessfullyGenerated(true)
                                    setButtonDisable(false)
                                }
                            }
                        })
                        .catch((error) => {
                            setGenerating(false)
                            setButtonDisable(false)
                        })

                } else {
                    clearInterval(intervalId)
                    timer = 0
                    setGenerating(false)
                    setJobId(null)
                    setButtonDisable(false)
                }
            }, 10000)
            return () => clearInterval(intervalId);
        } else {
            setButtonDisable(false)
        }
    }, [jobId])


    const onSearchTemplateClick = (data) => {
        setGenerating(true)
        setIsSuccessfullyGenerated(false)
        setButtonDisable(true)
        setIsSubmitButtonClick(true)
        setDisplayedQuestions([])
        axios.post("question_bank/create-ai-job",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                if (res.status === 201 && res.data.status_code === 1) {
                    setJobId(res.data.job_id)
                } else {
                    setButtonDisable(false)
                }
            })
            .catch((error) => {
                setGenerating(false)
                setButtonDisable(false)
            })
    };


    const onSearchTemplateClickT = async () => {
        setGenerating(true)
        setIsSuccessfullyGenerated(false)
        setButtonDisable(true)
        setIsSubmitButtonClick(true)
        setDisplayedQuestions([])

        const llm_reply = data.llm_reply

        setJobId(null)
        setGenerating(false)
        await generateObject(llm_reply)
        setIsSuccessfullyGenerated(true)
        setButtonDisable(false)
    }

    const getTheCurrentQuestionTemplate = () => {
        const qtpe = getValues("question_type")
        const QuestionTemplate = questionTypeComponents[qtpe] || NormalQuestionTemplateAI;
        return (
            <QuestionTemplate
                toastRef={alertRef}
                question={copied}
                setSubmittedQuestionCount={() => setCurrentSubmittedQuestions(prevState => prevState + 1)}
            />
        );
    }


    // const onPaperClick = (data) => {
    //     const encryptedID = data.id
    //     if (!data.isQuestionPaperSubmitted) {
    //         setIsButtonDisabled(true)
    //         setQuestionTypes([])
    //         axios.get('/paper_config/search-by-id', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             params: {
    //                 encryptedId: encryptedID
    //             }
    //         })
    //             .then(response => {
    //                 if (response.data.s === 1) {
    //                     dispatch(setQuestionConfiguration(response.data.config))
    //                     setQuestionType(response.data.config)
    //                     handleTransition(SEARCH_TEMPLATE)
    //                     setIsButtonDisabled(false)
    //                 }
    //             })
    //             .catch(error => {
    //                 setIsButtonDisabled(false)
    //                 console.error("There was an error fetching the data!", error);
    //
    //             });
    //
    //     }
    //
    // };

    const getText = () => {
        if (generating)
            return "Generating questions..."
        else if (displayedQuestions.length !== 0)
            return ""
        else
            return ""
    }


    const waitOneSecond = () => {
        return new Promise(resolve => setTimeout(resolve, 1));
    };


    const generateObject = async (data) => {
        for (const questionObj of data.questions) {
            const index = data.questions.indexOf(questionObj);
            // Check if options key exists and define the keys array accordingly
            let keys = ['question', 'correct_answer', 'explanation'];

            // If options key exists, add it between question and answer
            if (questionObj['options']) {
                keys = ['question', 'options', 'correct_answer', 'explanation'];
            }

            for (const key of keys) {
                let question = questionObj[key]
                if (key === 'options') {
                    let optionKey = 0;
                    for (const option of question) {
                        optionKey += 1
                        await generateTheObject(option, optionKey, index, 'options')
                    }

                } else {
                    await generateTheObject(question, key, index)
                }
            }
            await generateTheObject(index, 'id', index, "id")
        }
    }

    const generateTheObject = async (question, key, index, parentKey = '') => {
        let currentText = "";

        // Loop through each character in the question/answer
        if (parentKey === 'id') {
            setDisplayedQuestions(prevData => {
                const updatedData = [...prevData];

                updatedData[index][key] = question;

                return updatedData;
            });
            return
        }
        for (const t of question) {
            currentText += t;

            setDisplayedQuestions(prevData => {
                const updatedData = [...prevData];

                // Initialize the object for the question if it doesn't exist
                if (!updatedData[index]) {
                    updatedData[index] = {};
                }

                // Handle the special case for options key
                if (parentKey === 'options') {
                    if (!updatedData[index].options) {
                        updatedData[index].options = {}; // Initialize options if not exists
                    }

                    // Update the specific option key under options
                    updatedData[index].options[key] = currentText;
                } else {
                    // Update the regular question or answer key
                    updatedData[index][key] = currentText;
                }

                return updatedData;
            });

            await waitOneSecond(); // Wait before adding the next character
        }
    }



    const onCopyClick = (item) =>{
        setCopied(item)
        window.scrollTo({
            top: 300,
            behavior: 'smooth'
        });
    }

    const getIcon = () =>{
        if(succssfullyGenerated){
            return thinkComplete
        }
        return thinking
    }


    return (
        <TeacherLayout breadcrumbItems={breadcrumbData} toastRef={alertRef}>
            <QuestionBankCard
                className={`animation-container ${isTransitioning ? 'fade-exit' : 'fade-enter'} position-releative`}
                onClick={handleSubmitSearchTemplate(onSearchTemplateClick)} btnName="Search"
                isButtonDisabled={buttonDisable}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Question Type*</label>
                            <Controller
                                name="question_type"
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
                                        options={QuestionType}
                                        optionLabel="name"
                                        optionValue="value"
                                        className={`w-100 ${errorsSearchTemplate.question_type && "p-invalid"}`}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Course Category*</label>
                            <Controller
                                name="course_category"
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
                                        options={CourseCategories}
                                        optionLabel="name"
                                        optionValue="value"
                                        className={`w-100 ${errorsSearchTemplate.course_category && "p-invalid"}`}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Discipline*</label>
                            <Controller
                                name="discipline"
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
                                        options={Disciples}
                                        optionLabel="name"
                                        optionValue="value"
                                        className={`w-100 ${errorsSearchTemplate.discipline && "p-invalid"}`}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Topic*</label>
                            <InputText name='topic'
                                       className={`${errorsSearchTemplate.topic && 'p-invalid'} form-control`} {...register('topic', {required: true})}/>
                        </div>
                    </div>
                </div>
            </QuestionBankCard>
            {isSubmitButtonClick &&
                (
                    <div className="row">
                        <div className="col-md-6">
                            {
                                getTheCurrentQuestionTemplate()
                            }
                        </div>
                        <div className="col-md-6 py-4">
                            <div className="card">
                                <div className="card-header">
                                    <div className="d-flex align-items-center gap-2">
                                        <div>
                                            <div style={{height: "auto", overflow: "hidden"}}>
                                                <Lottie animationData={getIcon()} loop={true} autoplay={true}
                                                        style={{height: '50px'}}/>
                                            </div>
                                        </div>
                                        <h3 className="m-0">Suggested Questions</h3>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="bolder-text">
                                        {getText()}
                                    </div>
                                    {generating &&
                                        <div style={{height: "50px", overflow: "hidden"}}>
                                            <Lottie animationData={generatingAnimation} loop={true} autoplay={true}
                                                    style={{height: '100px', marginTop: "-31px"}}/>
                                        </div>
                                    }
                                </div>
                                {displayedQuestions.map((item, index) => (
                                    <div key={index} className="mt-4 ai-question">
                                        <div className='ai-area'>
                                            <div>
                                                <p>
                                                    <span>Q{index + 1}.</span> {item.question}
                                                </p>
                                                {
                                                    (item.options !== undefined && item.options !== null) &&
                                                    <ul>
                                                        {Object.keys(item.options).map((key) => (
                                                            <li key={key}>
                                                                <span>{key}.</span> {item.options[key]}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                }

                                                {
                                                    (item.correct_answer !== undefined && item.correct_answer !== null) &&
                                                    <p className="ai_answer">
                                                        <span>A{index + 1}.</span> {item.correct_answer}
                                                    </p>
                                                }

                                            </div>
                                            <div>
                                                {(item.id !== undefined && item.id !== null && item.id !== '') &&
                                                    <FontAwesomeIcon icon={faCopy} onClick={()=> onCopyClick(item)}/>
                                                }
                                            </div>
                                        </div>
                                        {
                                            (item.explanation !== undefined && item.explanation !== null) &&
                                            <p className="ai_answer border-top border-gray-900 border-1 pt-3">
                                                <span>Explanation.</span> {item.explanation}
                                            </p>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

        </TeacherLayout>
    );
};

export default QuestionBankCreation;
