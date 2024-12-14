import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {Dropdown} from "primereact/dropdown";
import {useDispatch, useSelector} from "react-redux";
import {
    setActiveDetails, setActivityTypes, setCourseTypes, setDisciplines, setPapers, setSemester,
} from "../../Redux/selectTagOptionsSlice";
import PropTypes from "prop-types";
import QuestionBankCard from "./QuestionBankCard.jsx";
import apiCall from "../../Axios/APIHelper.jsx";

const SearchPaper = ({onLoadChapterClick, isWon = true}) => {
    const dispatch = useDispatch();

    // Load saved form values from localStorage or use an empty object
    const savedFormValues = JSON.parse(localStorage.getItem("savedFormValues")) || {};

    const {
        handleSubmit: handleSubmitLoadChapter,
        control: controlLoadChapter,
        formState: {errors: errorsLoadChapter},
        getValues: getValuesLoadChapter
    } = useForm({
        defaultValues: savedFormValues,
    });

    const courseTypes = useSelector((state) => state.selectTagOptions.courseTypes);
    const disciplines = useSelector((state) => state.selectTagOptions.disciplines);
    const semesters = useSelector((state) => state.selectTagOptions.semesters);
    const papers = useSelector((state) => state.selectTagOptions.papers);
    const activityTypes = useSelector((state) => state.selectTagOptions.activityTypes);

    useEffect(() => {
        apiCall({
            url: '/search_data/course_types',
            showLoadingIndicator: false, params: {
                isWon: isWon
            }
        })
            .then((data) => {
                dispatch(setCourseTypes(data));
            })
            .catch((ex) => console.log(ex));
    }, [isWon]);


    const onChangeCourseType = (field, e) => {
        apiCall({
            url: "search_data/course_discipline", params: {
                courseTypeId: (e.value), isWon: isWon
            }
        })
            .then((data) => {
                dispatch(setDisciplines(data));

            })
            .catch((ex) => console.log(ex));
        field.onChange(e.value);
    };

    const onChangeDiscipline = (field, e) => {
        apiCall({
            url: "search_data/semester", params: {
                discipline_id: e.value
            }
        })
            .then((data) => {
                dispatch(setSemester(data));

            })
            .catch((ex) => console.log(ex));
        field.onChange(e.value);
    };

    const onChangeSemester = (field, e) => {
        field.onChange(e.value);
        const discipline = getValuesLoadChapter("discipline");

        apiCall({
            url: "search_data/paper_master", params: {
                discipline_id: (discipline), semester: e.value,
            }
        })
            .then((data) => {
                dispatch(setPapers(data));

            })
            .catch((ex) => console.log(ex));
    };

    const onChangePaper = (field, e) => {
        field.onChange(e.value);
        apiCall({
            url: "search_data/activities",
            params: {
                paper_master: e.value,
            }
        }).then(data => {
            dispatch(setActivityTypes(data));

        }).catch((ex) => console.log(ex));

    }

    const onClickHandler = (data) => {
        localStorage.setItem("savedFormValues", JSON.stringify(data));
        const course_type = courseTypes.find(it => it.value === getValuesLoadChapter('course_type'))
        const discipline = disciplines.find(it => it.value === getValuesLoadChapter('discipline'))
        const semester = semesters.find(it => it.value === getValuesLoadChapter('semester'))
        const paper = papers.find(it => it.value === getValuesLoadChapter('paper'))
        const activityType = activityTypes.find(it => it.value === getValuesLoadChapter('activityType'))
        dispatch(setActiveDetails({
            courseType: course_type,
            discipline: discipline,
            semester: semester,
            paper: paper,
            activityType: activityType,
        }))
        onLoadChapterClick(data);
    };

    return (<QuestionBankCard btnName="Configure" onClick={handleSubmitLoadChapter(onClickHandler)}>
        <div className="col-md-2">
            <div className="form-group">
                <label>Course Type*</label>
                <Controller
                    name="course_type"
                    rules={{
                        validate: (value) => value !== undefined || "This field is required",
                    }}
                    control={controlLoadChapter}
                    render={({field}) => (<Dropdown
                        id={field.name}
                        value={field.value}
                        onChange={(e) => onChangeCourseType(field, e)}
                        placeholder="-- Select --"
                        options={courseTypes}
                        optionLabel="name"
                        optionValue="value"
                        className={`w-100 ${errorsLoadChapter.course_type && "p-invalid"}`}
                    />)}
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
                    control={controlLoadChapter}
                    render={({field}) => (<Dropdown
                        id={field.name}
                        value={field.value}
                        onChange={(e) => onChangeDiscipline(field, e)}
                        placeholder="-- Select --"
                        options={disciplines}
                        optionLabel="name"
                        optionValue="value"
                        className={`w-100 ${errorsLoadChapter.discipline && "p-invalid"}`}
                    />)}
                />
            </div>
        </div>
        <div className="col-md-2">
            <div className="form-group">
                <label>Semester*</label>
                <Controller
                    name="semester"
                    rules={{
                        validate: (value) => value !== undefined || "This field is required",
                    }}
                    control={controlLoadChapter}
                    render={({field}) => (<Dropdown
                        id={field.name}
                        value={field.value}
                        onChange={(e) => onChangeSemester(field, e)}
                        placeholder="-- Select --"
                        options={semesters}
                        optionLabel="name"
                        optionValue="value"
                        className={`w-100 ${errorsLoadChapter.semester && "p-invalid"}`}
                    />)}
                />
            </div>
        </div>
        <div className="col-md-3">
            <div className="form-group">
                <label>Paper*</label>
                <Controller
                    name="paper"
                    rules={{
                        validate: (value) => value !== undefined || "This field is required",
                    }}
                    control={controlLoadChapter}
                    render={({field}) => (<Dropdown
                        id={field.name}
                        value={field.value}
                        onChange={(e) => onChangePaper(field, e)}
                        placeholder="-- Select --"
                        options={papers}
                        optionLabel="name"
                        optionValue="value"
                        className={`w-100 ${errorsLoadChapter.paper && "p-invalid"}`}
                    />)}
                />
            </div>
        </div>
        <div className="col-md-2">
            <div className="form-group">
                <label>Activity Type*</label>
                <Controller
                    name="activity_type"
                    rules={{
                        validate: (value) => value !== undefined || "This field is required",
                    }}
                    control={controlLoadChapter}
                    render={({field}) => (<Dropdown
                        id={field.name}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder="-- Select --"
                        options={activityTypes}
                        optionLabel="activity_name"
                        optionValue="id"
                        className={`w-100 ${errorsLoadChapter.activityType && "p-invalid"}`}
                    />)}
                />
            </div>
        </div>
    </QuestionBankCard>);
};

SearchPaper.propTypes = {
    onLoadChapterClick: PropTypes.func.isRequired, isWon: PropTypes.bool
};

export default SearchPaper;
