import AdminLayout from "../../AdminLayout.jsx";
import {useForm, Controller} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import apiCall from "../../../../Axios/APIHelper.jsx";
import {useTranslation} from "react-i18next";
import {Dropdown} from "primereact/dropdown";

const AddRegistrationByCourse = () => {

    const {t} = useTranslation(); // Hook for translations

    // State to keep track of selected students
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [batch, setBatch] = useState([]);
    const [academicYear, setAcademicYear] = useState([]);
    const [term, setTerm] = useState([]);
    const [specializationName, setSpecializationName] = useState([]);
    const [concentration, setConcentration] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedTerm, setSelectedTerm] = useState(null);



    useEffect(() => {
        apiCall({
            url: '/dropdown/users',
            showLoadingIndicator: false
        }).then((res) => {
            setStudents(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })

        apiCall({
            url: '/dropdown/disciplines',
            showLoadingIndicator: false
        }).then((res) => {
            setPrograms(res)
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

    const handleAcademicYear = (value) => {
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
            url: '/dropdown/specializations',
            showLoadingIndicator: false
        }).then((res) => {
            setSpecializationName(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })

        apiCall({
            url: '/dropdown/course-offers',
            params: {'academicSession': selectedSession},
            showLoadingIndicator: false
        }).then((res) => {
            setCourses(res)
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

    const handleConcentrationChange = () => {

    }


    // Handle individual checkbox toggle
    const handleCheckboxChange = (studentId) => {
        setSelectedStudents((prevSelected) => {
            if (prevSelected.includes(studentId)) {
                return prevSelected.filter((id) => id !== studentId);
            } else {
                return [...prevSelected, studentId];
            }
        });
    };

    // Handle "Select All" checkbox toggle
    const handleSelectAllChange = (event) => {
        if (event.target.checked) {
            setSelectedStudents(students.map((student) => student.value));
        } else {
            setSelectedStudents([]);
        }
    };

    // Check if all students are selected
    const isAllSelected = students.length === selectedStudents.length;

    const toast = useRef(null);
    const navigate = useNavigate();

    const breadcrumbData = [
        {name: t("Registration.breadcrumb.dashboard"), url: "/admin/dashboard"},
        {name: t("Registration.breadcrumb.crud"), url: "/admin/crud"},
        {name: t("Registration.breadcrumb.courses"), url: "/admin/crud/enrollment"},
        {name: t("Registration.breadcrumb.add_registration_by_course")},
    ];

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmitForm = (data) => {
    if (selectedStudents.length === 0) {
      toast.current.show({
        severity: "error",
        summary: t("Registration.toast.error"),
        detail: t("Registration.toast.noStudentsSelected"),
        life: 3000,
      });
      return; // Stop submission
    }
  
    const payload = {
      userIdList: selectedStudents.map((studentId) => ({ userId: studentId })),
      courseOfferId: data.course,
      term: data.term,
    };
  
    apiCall({
      url: "/enrollment/enrollByCourse",
      data: payload,
      method: "post",
      showLoadingIndicator: false,
    })
      .then((res) => {
          toast.current.show({
            severity: "success",
            summary: t("Registration.toast.success"),
            detail: t("Registration.toast.successDetail"),
            life: 3000,
          });
          reset();
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
  

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="row">
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
                                                    handleProgramChange();
                                                }}
                                                placeholder={t("Registration.select")}
                                                optionLabel="name"
                                                filter
                                                filterBy="name"
                                                className={`${errors.program && "p-invalid"} w-100`}
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
                                                    field.onChange(e.value)
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
                                                    handleAcademicYear(e.value)
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
                                                    field.onChange(e.value)
                                                    setSelectedTerm(selected.name || null)
                                                    handleTermChange()
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
                        {
                            (selectedTerm && ["TERM-1", "TERM-2", "TERM-3"].includes(selectedTerm)) ? <></>
                               : (
                                    <div className="row mt-3">
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
                                                                field.onChange(e.value)
                                                                handleSpecializationChange(e.value)
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
                                                                field.onChange(e.value)
                                                                handleConcentrationChange();
                                                            }}
                                                            placeholder={t("Registration.select")}
                                                            filter
                                                            filterBy="name"
                                                            className={`${errors.concentration && "p-invalid"} w-100`}
                                                            optionLabel="name"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )

                        }
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <label>{t("Registration.course")}*</label>
                                <div className="form-group">
                                    <Controller
                                        name="course"
                                        control={control}
                                        rules={{required: true}}
                                        render={({field}) => (
                                            <Dropdown
                                                value={field.value}
                                                options={courses}
                                                onChange={(e) => field.onChange(e.value)}
                                                placeholder={t("Registration.select")}
                                                filter
                                                filterBy="name"
                                                className={`${errors.course && "p-invalid"} w-100`}
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
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Select Student</h5>
                            <div className="form-group form-check mt-4 pb-2 border-bottom">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="selectAll"
                                    onChange={handleSelectAllChange}
                                    checked={isAllSelected}
                                />
                                <label className="form-check-label" htmlFor="selectAll">
                                    {t("Registration.select_all")}
                                </label>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="scrollable-list">
                                <div className="row mt-0">
                                    <div className="col">
                                        {students.map((student) => (
                                            <div className="form-group form-check mt-2" key={student.id}>
                                                <input
                                                    type="checkbox"
                                                    name="student"
                                                    value={student.value}
                                                    className="form-check-input student-checkbox"
                                                    id={student.value}
                                                    checked={selectedStudents.includes(student.value)}
                                                    onChange={() => handleCheckboxChange(student.value)}
                                                />
                                                <label className="form-check-label" htmlFor={student.value}>
                                                    {student.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <NavLink to="javascript:void(0)" onClick={handleSubmit(onSubmitForm)}
                             className="btn btn-primary-violet">
                        Save
                    </NavLink>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddRegistrationByCourse;
