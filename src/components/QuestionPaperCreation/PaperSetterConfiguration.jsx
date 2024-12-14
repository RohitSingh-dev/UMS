import {useEffect, useRef, useState} from "react";
import QuestionBankCard from "./QuestionBankCard.jsx";
import {LOAD_CHAPTER, SEARCH_TEMPLATE} from "../../Util/AppConstant.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {restSelectTagOptionsSlice} from "../../Redux/selectTagOptionsSlice.jsx";
import BOSLayout from "../BOS/BOSLayout.jsx";
import SearchPaper from "./SearchPaper.jsx";
import {NavLink} from "react-router-dom";
import {PickList} from "primereact/picklist";
import {Dropdown} from "primereact/dropdown";
import apiCall from "../../Axios/APIHelper.jsx";

const PaperSetterConfiguration = () => {
    const toast = useRef(null)
    const [currentStep, setCurrentStep] = useState(LOAD_CHAPTER);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const currentCourseType = useSelector(state => state.selectTagOptions.activeCourseType)
    const currentDiscipline = useSelector(state => state.selectTagOptions.activeDiscipline)
    const currentSemester = useSelector(state => state.selectTagOptions.activeSemester)
    const currentPaper = useSelector(state => state.selectTagOptions.activePaper)
    const currentActivityType = useSelector(state => state.selectTagOptions.activeActivityType)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const dispatch = useDispatch()
    const [configurationId, setConfigurationId] = useState(null);
    const [allTeacher, setAllTeacher] = useState([]);
    const [allModaretedTeacher, setAllModaretedTeacher] = useState([]);
    const [moderator, setModerator] = useState(null);
    const [allSelectedTeacher, setAllSelectedTeacher] = useState([]);


    useEffect(() => {
        return () => {
            dispatch(restSelectTagOptionsSlice())
            localStorage.clear("savedFormValues");
        };
    }, [])

    const breadcrumbData = [
        {name: "Dashboard", url: "/bos/dashboard"},
        {name: "Paper Setter Configuration"},
    ];
    const onLoadChapterClick = (data) => {
        setIsButtonDisabled(true)
        apiCall({
            url: '/paper_config/teachers',
            params: data,
            method: 'get',
            showLoadingIndicator: false
        })
            .then(data => {
                handleTransition(SEARCH_TEMPLATE);
                setAllTeacher(data.teachers)
                setAllModaretedTeacher(data.teachers)
                setConfigurationId(data.configuration_id)
                setIsButtonDisabled(false)
            })
            .catch(error => {
                setIsButtonDisabled(false)
                console.log(error)
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data,
                    life: 3000
                });
            });

    };


    const handleTransition = (nextStep) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(nextStep);
            setIsTransitioning(false);
        }, 500);
    };


    const onChange = (event) => {
        setAllTeacher(event.source);
        setAllSelectedTeacher(event.target);
    };

    const itemTemplate = (item) => {
        return (

            <div className="d-flex flex-row justify-content-between gap-2">
                <div className="d-inline-block">
                    <span>{item.name}</span>
                </div>
                <span>{item.count}</span>
            </div>

        );
    };

    const onClickSubmit = () => {
        if (allSelectedTeacher.length === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select at least one teacher',
                life: 3000
            });
            return
        }
        if (moderator === null) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please chose a moderator',
                life: 3000
            });
            return
        }
        const data = {
            teachers: allSelectedTeacher,
            configuration_id: configurationId,
            moderator: moderator
        }
        setIsButtonDisabled(true)

        apiCall({
            url: '/paper_config/assign-teacher',
            method: 'post',
            data: data
        })
            .then(() => {
                handleTransition(LOAD_CHAPTER);
                setAllTeacher(null)
                setAllSelectedTeacher(null)
                setConfigurationId(null)
                setIsButtonDisabled(false)
            })
            .catch(error => {
                setIsButtonDisabled(false)
                console.log(error)
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data,
                    life: 3000
                });
            });
    }

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
                                    </div>
                                </QuestionBankCard>
                                <QuestionBankCard onClick={onClickSubmit} isButtonDisabled={isButtonDisabled}
                                                  header="Select teacher(s) for question bank"
                                                  btnName='Submit'>
                                    <PickList dataKey="id" source={allTeacher} target={allSelectedTeacher}
                                              onChange={onChange}
                                              showSourceControls={false} showTargetControls={false} className='myPicker'
                                              itemTemplate={itemTemplate} filter filterBy="name" breakpoint="1280px"
                                              sourceHeader="All Teacher" targetHeader="Selected Teacher(s)"
                                              sourceStyle={{height: '24rem'}} targetStyle={{height: '24rem'}}
                                              sourceFilterPlaceholder="Search by name"
                                              targetFilterPlaceholder="Search by name"/>
                                    <div
                                        className='d-flex align-items-start align-items-sm-center gap-1 gap-sm-3 flex-column flex-sm-row'>
                                        <label className='color-black'>Moderator:</label>
                                        <Dropdown
                                            id="modaretorDropdown"
                                            value={moderator}
                                            onChange={(e) => {
                                                setModerator(e.value);
                                            }}
                                            placeholder="-- Select --"
                                            options={allModaretedTeacher}
                                            optionLabel="name"
                                            optionValue="id"
                                            className={`w-100`}
                                        />
                                    </div>
                                </QuestionBankCard>
                            </>
                        )
                }
            </div>
        </BOSLayout>
    );
};

export default PaperSetterConfiguration;
