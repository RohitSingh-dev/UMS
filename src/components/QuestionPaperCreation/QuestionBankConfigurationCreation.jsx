import {useEffect, useRef, useState} from "react";
import QuestionBankCard from "./QuestionBankCard.jsx";
import {LOAD_CHAPTER, SEARCH_TEMPLATE} from "../../Util/AppConstant.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {restSelectTagOptionsSlice, setQuestionConfiguration} from "../../Redux/selectTagOptionsSlice.jsx";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import BOSLayout from "../BOS/BOSLayout.jsx";
import SearchPaper from "./SearchPaper.jsx";
import {NavLink} from "react-router-dom";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import apiCall from "../../Axios/APIHelper.jsx";

const QuestionBankConfigurationCreation = () => {
    const [currentStep, setCurrentStep] = useState(LOAD_CHAPTER);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const currentCourseType = useSelector(state => state.selectTagOptions.activeCourseType)
    const currentDiscipline = useSelector(state => state.selectTagOptions.activeDiscipline)
    const currentSemester = useSelector(state => state.selectTagOptions.activeSemester)
    const currentPaper = useSelector(state => state.selectTagOptions.activePaper)
    const currentActivityType = useSelector(state => state.selectTagOptions.activeActivityType)
    const questionConfiguration = useSelector(state => state.selectTagOptions.questionConfiguration)
    const dispatch = useDispatch()
    const toast = useRef(null)
    const [rows, setRows] = useState([]);
    const [totalMark, setTotalMark] = useState(0)
    const [isEditable, setIsEditable] = useState(true)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [id, setId] = useState(null);
    const [paperMarks, setPaperMarks] = useState(0);

    const latestQuestionConfiguration = useRef(questionConfiguration);

    useEffect(() => {
        latestQuestionConfiguration.current = questionConfiguration;
    }, [questionConfiguration]);


    const breadcrumbData = [
        {name: "Dashboard", url: "/bos/dashboard"},
        {name: "Question Bank Configuration"},
    ];

    useEffect(() => {
        // Initialize first row when questionConfiguration changes
        if (questionConfiguration.length > 0) {
            setRows([{
                id: 1,
                section: "",
                question_type: "",
                total_question: "",
                maximum_answerable: "",
                marks: "",
                totalMarks: 0
            }]);
        }
    }, [questionConfiguration]);

    const addNewRow = () => {
        const newRow = {
            id: rows.length + 1,
            section: "",
            question_type: "",
            total_question: "",
            maximum_answerable: "",
            marks: "",
            totalMarks: 0
        };
        setRows([...rows, newRow]);
    };

    useEffect(() => {
        calculateTotal();
    }, [rows]);

    const removeRow = (rowId) => {
        setRows(prevRows => {
            const updatedRows = prevRows.filter(row => row.id !== rowId);

            return updatedRows.map((row, index) => ({
                ...row,
                id: index + 1
            }));
        });
    };


    const updateRowData = (rowId, field, value) => {
        setRows(prevRows => {
            return prevRows.map(row => {
                if (row.id === rowId) {
                    const updatedRow = {...row, [field]: value};
                    if ((field === 'maximum_answerable' || field === 'marks') &&
                        updatedRow.maximum_answerable && updatedRow.marks) {
                        updatedRow.totalMarks =
                            parseInt(updatedRow.maximum_answerable) * parseInt(updatedRow.marks);
                    }
                    return updatedRow;
                }
                return row;
            });
        });
    };

    useEffect(() => {
        return () => {
            dispatch(restSelectTagOptionsSlice())
            localStorage.clear("savedFormValues");
        };
    }, [])


    const handleTransition = (nextStep) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(nextStep);
            setIsTransitioning(false);
        }, 500);
    };

    const onLoadChapterClick = (data) => {
        setIsButtonDisabled(true)
        apiCall({
            url: "/paper_config/search",
            params: data,
            showLoadingIndicator: false
        })
            .then(data => {
                setPaperMarks(data.paper_marks);
                if (data.s === 1) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Message',
                        detail: 'Configuration already saved for this paper for this semester',
                        life: 3000
                    });
                    //TODO: HERE WE WRITE CODE SO THE USER CAN SEE THE CONFIGURATION AND CAN EDIT THIS

                } else if (data.s === 0) {
                    // no data present so create new configuration
                    apiCall({
                        url: '/search_data/question-types',
                        showLoadingIndicator: false
                    })
                        .then(data => {
                            dispatch(setQuestionConfiguration(data))
                            setIsEditable(true)
                            setTotalMark(0)
                            handleTransition(SEARCH_TEMPLATE)
                            setIsButtonDisabled(false)
                            setId(null)
                        })
                        .catch(error => {
                            console.error("There was an error fetching the data!", error);
                            setIsButtonDisabled(false)
                        });
                }
            })
            .catch(error => {
                setIsButtonDisabled(false)
                console.error("There was an error fetching the data!", error);
            });

    };

    const onConfigureQuestionPaperClick = () => {
        setIsButtonDisabled(false)
        const formValues = JSON.parse(localStorage.getItem("savedFormValues")) || {};

        if (!rows[0]?.question_type) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please chose at least one Question Type',
                life: 3000
            });
            return
        }
        for (const row of rows) {
            if (!row.section) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Section field cannot be empty',
                    life: 3000
                });
                return;
            }
            if (!row.question_type) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Question Type field cannot be empty',
                    life: 3000
                });
                return;
            }
            if (!row.total_question) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Total Questions field cannot be empty',
                    life: 3000
                });
                return;
            }
            if (!row.maximum_answerable) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Maximum Answerable Questions field cannot be empty',
                    life: 3000
                });
                return;
            }
            if (!row.marks) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Question Marks field cannot be empty',
                    life: 3000
                });
                return;
            }
            if (parseInt(row.total_question) < parseInt(row.maximum_answerable)) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Total Questions must be greater than Maximum Answerable Questions',
                    life: 3000
                });
                return;
            }
        }
        if (totalMark === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Total Marks Can not be zero',
                life: 3000
            });
            return
        }
        if (totalMark !== paperMarks) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Total Marks must be exactly ${paperMarks}`,
                life: 3000
            });
            return;
        }

        formValues['configuration'] = rows.map(row => ({
            id: row.question_type?.id || null,
            section: row.section || "",
            question_type: row.question_type?.question_type || "",
            total_question: parseInt(row.total_question) || 0,
            answerable_question: parseInt(row.maximum_answerable) || 0,
            marks: parseInt(row.marks) || 0,
            section_marks: parseInt(row.totalMarks) || 0
        })).filter(row => row.question_type !== "");
        formValues['id'] = id;

        apiCall({
            url: "paper_config/add",
            method: "post",
            data: formValues,
            retryOnTokenExpired: true
        })

            .then(() => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Question type successfully created',
                    life: 3000
                });
                setTimeout(() => {
                    handleTransition(LOAD_CHAPTER)
                    setIsButtonDisabled(true)
                }, 500)
            })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
                setIsButtonDisabled(false)
            })
    };

    const calculateTotal = () => {
        const total = rows.reduce((sum, row) => sum + (row.totalMarks || 0), 0);
        setTotalMark(total);
    };

    const sectionTemplate = (rowData) => {
        return (
            <InputText
                type="text"
                value={rowData.section || ""}
                onChange={(e) => updateRowData(rowData.id, 'section', e.target.value)}
                style={{width: "100%"}}
            />
        );
    };

    const questionTypeTemplate = (rowData) => {
        return (
            <Dropdown
                value={rowData.question_type}
                options={questionConfiguration}
                optionLabel="question_type"
                onChange={(e) => updateRowData(rowData.id, 'question_type', e.value)}
                placeholder="Select Type"
                style={{width: "100%"}}
            />
        );
    };

    const questionWantTemplate = (rowData) => {
        return (
            <InputText
                type="text"
                keyfilter="int"
                value={rowData.total_question}
                onChange={(e) => updateRowData(rowData.id, 'total_question', e.target.value)}
                style={{width: "100%"}}
            />
        );
    };

    const questionChoiceTemplate = (rowData) => {
        return (
            <InputText
                type="text"
                keyfilter="int"
                value={rowData.maximum_answerable}
                onChange={(e) => updateRowData(rowData.id, 'maximum_answerable', e.target.value)}
                style={{width: "100%"}}
            />
        );
    };

    const marksTemplate = (rowData) => {
        return (
            <InputText
                type="text"
                keyfilter="int"
                value={rowData.marks}
                onChange={(e) => updateRowData(rowData.id, 'marks', e.target.value)}
                style={{width: "100%"}}
            />
        );
    };

    const actionTemplate = (rowData) => {
        if (rows.length !== 1) {
            return (
                <div className="flex gap-2">
                    <Button
                        className="row-delete-btn"
                        onClick={() => removeRow(rowData.id)}
                    >
                        <FontAwesomeIcon icon={faTimes}/>
                    </Button>
                </div>
            );
        }
        return null;
    };

    const totalMarksTemplate = (rowData) => {
        return <span>{rowData.totalMarks || 0}</span>;
    };

    return (
        <BOSLayout breadcrumbItems={breadcrumbData} toastRef={toast}>
            <div className={`animation-container ${isTransitioning ? 'fade-exit' : 'fade-enter'}`}>
                {
                    currentStep === LOAD_CHAPTER
                        ?
                        <SearchPaper onLoadChapterClick={(data) => onLoadChapterClick(data)}/>
                        :
                        (
                            <>
                                <NavLink to='' onClick={() => handleTransition(LOAD_CHAPTER)}
                                         className="back_to_previous">
                                    <FontAwesomeIcon icon={faArrowLeft}/> Back </NavLink>
                                <QuestionBankCard className='card' header='Details'>
                                    <div className="w-50 color-black">
                                        <p>
                                            <span>Discipline:&nbsp;</span> {currentDiscipline.name}
                                        </p>
                                        <p>
                                            <span>Course Type:&nbsp;</span> {currentCourseType.name}
                                        </p>
                                        <p>
                                            <span>Semester:&nbsp;</span> {currentSemester.name}
                                        </p>
                                    </div>
                                    <div className="w-50 color-black">
                                        <p>
                                            <span>Paper:&nbsp;</span> {currentPaper.name}
                                        </p>
                                        <p>
                                            <span>Activity Type:&nbsp;</span> {currentActivityType.activity_name.replace(/_/g, " ")}
                                        </p>
                                        <p>
                                            <span>Paper Marks:&nbsp;</span> {paperMarks}
                                        </p>
                                    </div>
                                </QuestionBankCard>
                                <QuestionBankCard btnName={`${isEditable ? 'Configure' : ''}`}
                                                  header="Question Paper Configuration"
                                                  isButtonDisabled={isButtonDisabled}
                                                  onClick={() => onConfigureQuestionPaperClick()}>
                                    <DataTable value={rows} tableStyle={{minWidth: '100%'}}>
                                        <Column
                                            field="section"
                                            header="Section Name"
                                            body={sectionTemplate}
                                            headerStyle={{width: "250px"}}
                                        />
                                        <Column
                                            field="question_type"
                                            header="Types"
                                            body={questionTypeTemplate}
                                            headerStyle={{width: "290px"}}
                                        />
                                        <Column
                                            field="total_question"
                                            header="Total Questions"
                                            body={questionWantTemplate}
                                            headerStyle={{width: "140px"}}
                                        />
                                        <Column
                                            field="maximum_answerable"
                                            header="Maximum Answerable"
                                            body={questionChoiceTemplate}
                                            headerStyle={{width: "140px"}}
                                        />
                                        <Column
                                            field="marks"
                                            header="Marks"
                                            body={marksTemplate}
                                            headerStyle={{width: "100px"}}
                                        />
                                        <Column
                                            field="totalMarks"
                                            header="Section Marks"
                                            body={totalMarksTemplate}
                                            headerStyle={{width: "100px"}}
                                            bodyStyle={{textAlign: "center"}}
                                        />
                                        <Column
                                            header="Delete"
                                            body={actionTemplate}
                                            headerStyle={{width: "40px"}}
                                        />
                                    </DataTable>

                                    <div className="mt-4 mb-4">
                                        <button
                                            className="btn btn-primary"
                                            onClick={addNewRow}
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="me-2"/>
                                            Add
                                        </button>
                                    </div>

                                    <div className='mt-4 d-flex justify-content-end'>
                                        <div className="color-black font-weight-600 font-18">
                                            Total Marks : {totalMark}/{paperMarks}
                                        </div>
                                    </div>
                                </QuestionBankCard>
                            </>
                        )
                }
            </div>
        </BOSLayout>
    );
};

export default QuestionBankConfigurationCreation;
