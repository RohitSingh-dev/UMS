import {Controller, useForm} from "react-hook-form";
import {Dropdown} from "primereact/dropdown";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useEffect} from "react";
import apiCall from "../../../../Axios/APIHelper.jsx";
import PropTypes from "prop-types";
import {SEARCH_STUDENT} from "../../../../Util/AppConstant.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setAcademicSession, setActiveDetails, setCourse} from "../../../../Redux/selectAttendanceOptionsSlice.jsx";

const SearchCourse = ({toast, handleTransition}) => {
    const dispatch = useDispatch();
    const course = useSelector((state) => state.selectAttendanceOptions.course);
    const academicSession = useSelector((state) => state.selectAttendanceOptions.academicSession);
    const { control,
        handleSubmit,
        getValues: getValuesLoadStudent,
        formState: { errors } } = useForm();

    useEffect(() => {
        apiCall({
            url: '/dropdown/academic-sessions',
            showLoadingIndicator: false
        }).then((res) => {
            dispatch(setAcademicSession(res))
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    },[])

    const handleAcademicSession = (value) => {
        apiCall({
            url: '/dropdown/course-offers',
            params: {'academicSession': value},
            showLoadingIndicator: false
        }).then((res) => {
            dispatch(setCourse(res))
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    const onSearchStudent = () => {
        const current_course = course.find(it => it.value === getValuesLoadStudent('course'))
        const current_academicSession = academicSession.find(it => it.value === getValuesLoadStudent('academicSession'));
        dispatch(setActiveDetails({
            course: current_course,
            academicSession: current_academicSession
        }))
        handleTransition(SEARCH_STUDENT)
    }

    return (
        <div className="card">
            <div className="row">
                <div className="col-md-6">
                    <label>Academic Session*</label>
                    <div className="form-group">
                        <Controller
                            name="academicSession"
                            control={control}
                            rules={{required: true}}
                            render={({field}) => (
                                <Dropdown
                                    value={field.value}
                                    options={academicSession}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                        handleAcademicSession(e.value);
                                    }}
                                    placeholder="Select"
                                    filter
                                    filterBy="name"
                                    className={`${errors.academicSession && "p-invalid"} w-100`}
                                    optionLabel="name"
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <label>Course*</label>
                    <div className="form-group">
                        <Controller
                            name="course"
                            control={control}
                            rules={{required: true}}
                            render={({field}) => (
                                <Dropdown
                                    value={field.value}
                                    options={course}
                                    onChange={(e) => field.onChange(e.value)}
                                    placeholder="Select"
                                    optionLabel="name"
                                    filter
                                    filterBy="name"
                                    className={`${errors.course && "p-invalid"} w-100`}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
            <button className="btn btn-primary-violet col-md-2" onClick={handleSubmit(onSearchStudent)}>
                <FontAwesomeIcon icon={faSearch} /> Search
            </button>
        </div>
    )
}
SearchCourse.propTypes = {
    toast: PropTypes.any.isRequired,
    handleTransition: PropTypes.func.isRequired
}

export default SearchCourse