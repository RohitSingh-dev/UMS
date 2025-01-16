import AdminLayout from "../../AdminLayout.jsx";
import {Controller, useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import {useNavigate, NavLink} from "react-router-dom";
import apiCall from "../../../../Axios/APIHelper.jsx";
import {useTranslation} from "react-i18next";
import {Dropdown} from "primereact/dropdown";

const AddRegistrationByStudent = () => {

    const {t} = useTranslation(); // Hook for translations

    const toast = useRef(null);
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [batch, setBatch] = useState([]);
    const [academicYear, setAcademicYear] = useState([]);
    const [term, setTerm] = useState([]);
    const [specializationName, setSpecializationName] = useState([]);
    const [concentration, setConcentration] = useState([]);
    const [courseOffers, setCourseOffers] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);

    const breadcrumbData = [
        {name: t("Registration.breadcrumb.dashboard"), url: "/admin/dashboard"},
        {name: t("Registration.breadcrumb.crud"), url: "/admin/crud"},
        {name: t("Registration.breadcrumb.courses"), url: "/admin/crud/enrollment"},
        {name: t("Registration.breadcrumb.add_registration_by_student")},
    ];

    useEffect(() => {
        apiCall({
            url: '/dropdown/programs',
            showLoadingIndicator: false
        }).then((res) => {
            setPrograms(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })

        apiCall({
            url: '/dropdown/specializations',
            showLoadingIndicator: false
        }).then((res) => {
            setSpecializationName(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }, [])

    const handleProgramChange = () => {
        apiCall({
            url: '/dropdown/batches',
            showLoadingIndicator: false
        }).then((res) => {
            setBatch(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    const handleBatchChange = () => {
        apiCall({
            url: '/dropdown/academic-sessions',
            showLoadingIndicator: false
        }).then((res) => {
            setAcademicYear(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    const handleAcademicSessionChange = (value) => {
        setSelectedSession(value)
        apiCall({
            url: '/dropdown/terms',
            params: {'academicSession': value},
            showLoadingIndicator: false
        }).then((res) => {
            setTerm(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    const handleTermChange = () => {
        apiCall({
            url: '/dropdown/users',
            params: {'batchName': selectedBatch},
            showLoadingIndicator: false
        }).then((res) => {
            setStudents(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    const handleSpecializationChange = (specializationId) => {
        const params = {'specialization': specializationId};
        apiCall({
            url: '/dropdown/concentrations',
            params: params,
            showLoadingIndicator: false
        }).then((res) => {
            setConcentration(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    const fetchCourses = () => {
        apiCall({
            url: '/dropdown/course-offers',
            params: {'academicSession': selectedSession},
            showLoadingIndicator: false
        }).then((res) => {
            setCourseOffers(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    useEffect(() => {
        if (["TERM-1", "TERM-2", "TERM-3"].includes(selectedTerm)) {
            fetchCourses(); // Fetch data when needed
        }
    }, [selectedTerm]);

    const {register, control, handleSubmit, formState: {errors}} = useForm();

    function transformArrayToObjects(arr) {
        return arr.map(item => ({courseOfferId: item}));
    }

    const onSubmitForm = (data) => {
        // Transform the input data to the desired format
        const transformedData = {
            userId: data.student,
            term: data.term,
            courseOfferList: transformArrayToObjects(selectedCourses),
        };
        console.log("Data", transformedData);
        apiCall({
            url: "/enrollment/enrollByStudent",
            data: transformedData,
            method: "post",
            showLoadingIndicator: false,
        })
            .then(() => {
                toast.current.show({
                    severity: "success",
                    summary: t("Registration.toast.success"),
                    detail: t("Registration.toast.successDetail"),
                    life: 3000,
                });
                navigate("/admin/crud/enrollment");
            })
            .catch((error) => {
                toast.current.show({
                    severity: "error",
                    summary: t("Registration.toast.error"),
                    detail: error.response?.data || t("Registration.toast.genericError"),
                    life: 3000,
                });
            });
    };

    const handleCourseSelection = (courseValue) => {
        console.log(courseValue)
        setSelectedCourses((prevSelected) => {
            if (prevSelected.includes(courseValue)) {
                return prevSelected.filter((id) => id !== courseValue);
            } else {
                return [...prevSelected, courseValue];
            }
        });
        console.log(selectedCourses)
    };

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <label>{t("Registration.program")}*</label>
                                <div className="form-group">
                                    <Controller
                                        name="program"
                                        control={control}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <Dropdown
                                                value={field.value}
                                                options={programs}
                                                onChange={(e) => {
                                                    field.onChange(e.value)
                                                    handleProgramChange()
                                                }}
                                                placeholder={t("Registration.select")}
                                                filter
                                                filterBy="name"
                                                className={`${errors.program && "p-invalid"} w-100`}
                                                optionLabel="name"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label>{t("Registration.batch")}*</label>
                                <div className="form-group">
                                    <Controller
                                        name="batch"
                                        control={control}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <Dropdown
                                                value={field.value}
                                                options={batch}
                                                onChange={(e) => {
                                                    const selected = batch.find(b => b.value === e.value);
                                                    field.onChange(e.value);
                                                    setSelectedBatch(selected?.name || null); // Set the name field or null if not found
                                                    handleBatchChange();
                                                }}
                                                placeholder={t("Registration.select")}
                                                filter
                                                filterBy="name"
                                                className={`${errors.batch && "p-invalid"} w-100`}
                                                optionLabel="name"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <label>{t("Registration.academic_year")}*</label>
                                <div className="form-group">
                                    <Controller
                                        name="academic_year"
                                        control={control}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <Dropdown
                                                value={field.value}
                                                options={academicYear}
                                                onChange={(e) => {
                                                    field.onChange(e.value)
                                                    handleAcademicSessionChange(e.value);
                                                }}
                                                placeholder={t("Registration.select")}
                                                filter
                                                filterBy="name"
                                                className={`${errors.academic_year && "p-invalid"} w-100`}
                                                optionLabel="name"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label>{t("Registration.term")}*</label>
                                <div className="form-group">
                                    <Controller
                                        name="term"
                                        control={control}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <Dropdown
                                                value={field.value}
                                                options={term}
                                                onChange={(e) => {
                                                    const selected = term.find(t => t.value === e.value);
                                                    field.onChange(e.value);
                                                    setSelectedTerm(selected?.name || null); // Set the name field or null if not found
                                                    handleTermChange();
                                                }}
                                                placeholder={t("Registration.select")}
                                                filter
                                                filterBy="name"
                                                className={`${errors.term && "p-invalid"} w-100`}
                                                optionLabel="name"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <label>{t("Registration.student_id")}*</label>
                                <div className="form-group">
                                    <Controller
                                        name="student"
                                        control={control}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <Dropdown
                                                value={field.value}
                                                options={students}
                                                onChange={(e) => field.onChange(e.value)}
                                                placeholder={t("Registration.select")}
                                                className={`${errors.student && "p-invalid"} w-100`}
                                                optionLabel="name"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card" style={{overflowX: "hidden", overflowY: "auto"}}>
                        <div>
                            <h5 className="text-uppercase" style={{fontWeight: "600"}}>
                                Add {t("courses.header")}
                            </h5>
                        </div>
                        <div className="row">
                            {selectedTerm && ["TERM-1", "TERM-2", "TERM-3"].includes(selectedTerm) ? (
                                // Show Courses as Checkboxes
                                <div className="row mt-3">
                                    <div className="col-md-12" style={{position: "absolute"}}>
                                        <label>{t("Registration.course")}s:</label>
                                        <div className="form-group">
                                            {courseOffers.length > 0 ? (
                                                courseOffers.map((course) => (
                                                    <div key={course.value} className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            id={course.value}
                                                            className="form-check-input"
                                                            value={course.value}
                                                            checked={selectedCourses.includes(course.value)}
                                                            onChange={() => handleCourseSelection(course.value)}
                                                        />
                                                        <label className="form-check-label" htmlFor={course.value}>
                                                            {course.name}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>{t("Registration.no_courses_available")}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Show Specialization and Concentration Dropdowns
                                <div className="row mt-3" style={{position: "absolute"}}>
                                    <div className="col-md-6">
                                        <label>{t("Registration.specialization_name")}*</label>
                                        <div className="form-group">
                                            <Controller
                                                name="specialization_name"
                                                control={control}
                                                rules={{required: true}}
                                                render={({field}) => (
                                                    <Dropdown
                                                        value={field.value}
                                                        options={specializationName}
                                                        onChange={(e) => {
                                                            field.onChange(e.value);
                                                            handleSpecializationChange(e.value);
                                                        }}
                                                        placeholder={t("Registration.select")}
                                                        filter
                                                        filterBy="name"
                                                        className={`${errors.specialization_name && "p-invalid"} w-100`}
                                                        optionLabel="name"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label>{t("Registration.concentration")}*</label>
                                        <div className="form-group">
                                            <Controller
                                                name="concentration"
                                                control={control}
                                                rules={{required: true}}
                                                render={({field}) => (
                                                    <Dropdown
                                                        value={field.value}
                                                        options={concentration}
                                                        onChange={(e) => {
                                                            field.onChange(e.value);
                                                            fetchCourses(); // Fetch courses when a concentration is selected
                                                        }}
                                                        placeholder={t("Registration.select")} filter
                                                        filterBy="name"
                                                        className={`${errors.concentration && "p-invalid"} w-100`}
                                                        optionLabel="name"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {courseOffers.length > 0 && (
                                        <div className="col-md-12 mt-3" >
                                            <label>{t("Registration.course")}s:</label>
                                            <div className="form-group">
                                                {courseOffers.map((course) => (
                                                    <div key={course.value} className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            id={course.value}
                                                            className="form-check-input"
                                                            value={course.value}
                                                            checked={selectedCourses.includes(course.value)}
                                                            onChange={() => handleCourseSelection(course.value)}
                                                        />
                                                        <label className="form-check-label" htmlFor={course.value}>
                                                            {course.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <NavLink to="javascript:void(0)" onClick={handleSubmit(onSubmitForm)}
                             className="btn btn-primary-violet me-3">
                        SAVE
                    </NavLink>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddRegistrationByStudent;
