import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {Controller, useForm} from "react-hook-form";
import axios from "axios";
import CookiesHelper from "../../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../Util/AppConstant.jsx";
import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Dropdown} from "primereact/dropdown";
import {setColleges, setDesignations, setDisciplines} from "../../../../Redux/selectTagOptionsSlice.jsx";
import {useDispatch, useSelector} from "react-redux";
import {Calendar} from "primereact/calendar";
import moment from "moment";


const AddUser = () => {
    const token = CookiesHelper.getCookie(JWT_COOKIES_NAME);
    const toast = useRef(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const designation = useSelector((state) => state.selectTagOptions.designation);
    const disciplines = useSelector((state) => state.selectTagOptions.disciplines);
    const colleges = useSelector((state) => state.selectTagOptions.colleges);

    const {register, handleSubmit, control, formState: {errors}} = useForm();

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "User", url: '/admin/crud/user'},
        {name: "Add Question Type"}
    ];

    useEffect(() => {
        axios
            .get("search_data/designations", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    dispatch(setDesignations(res.data));
                }
            })
            .catch((ex) => console.log(ex));
    }, []);

    const onChangeDesignation = (field, e) => {
        axios
            .get("search_data/colleges", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    designationId: e.value
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    dispatch(setColleges(res.data));
                }
            })
            .catch((ex) => console.log(ex));

        axios
            .get("search_data/course_discipline", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    dispatch(setDisciplines(res.data));
                }
            })
            .catch((ex) => console.log(ex));
        field.onChange(e.value);
    };

    const onSubmitForm = (data) => {
        axios.post("crud/user/create",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User successfully created',
                        life: 3000
                    });
                    setTimeout(() => {
                        navigate("/admin/crud/user");
                    }, 3000)
                }
            })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    const formatDate = (date) => {
        if (!date) return null;
        return moment(date).format('YYYY-MM-DD');
    };


    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)}>
                <AddDataCard header='Login Details' isSubDataCard={true}>
                    <div className='row'>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>User Name <span className='text-danger font-22'>*</span></label>
                                <InputText name='username' id='username' autoComplete='off'
                                           className={`w-100 ${errors.username && "p-invalid"}`} {...register('username', {
                                    required: {
                                        value: true,
                                        message: "User Name is required"
                                    },
                                })}/>
                            </div>
                            {errors.username && <span className="text-danger">{errors.username.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Designation <span className='text-danger font-22'>*</span></label>
                                <Controller
                                    name="designation"
                                    rules={{
                                        validate: (value) => value !== undefined || "Designation is required",
                                    }}
                                    control={control}
                                    render={({field}) => (
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => onChangeDesignation(field, e)}
                                            placeholder="-- Select --"
                                            options={designation}
                                            optionLabel="name"
                                            optionValue="value"
                                            className={`w-100 ${errors.designation && "p-invalid"}`}
                                            filter={true}
                                            filterBy="name"
                                        />
                                    )}
                                />
                            </div>
                            {errors.designation && <span className="text-danger">{errors.designation.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>College <span className='text-danger font-22'>*</span></label>
                                <Controller
                                    name="college"
                                    rules={{
                                        validate: (value) => value !== undefined || "Colleg is required",
                                    }}
                                    control={control}
                                    render={({field}) => (
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder="-- Select --"
                                            options={colleges}
                                            optionLabel="name"
                                            optionValue="value"
                                            className={`w-100 ${errors.college && "p-invalid"}`}
                                            filter={true}
                                            filterBy="name"
                                        />
                                    )}
                                />
                            </div>
                            {errors.college && <span className="text-danger">{errors.college.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Discipline <span className='text-danger font-22'>*</span></label>
                                <Controller
                                    name="discipline"
                                    rules={{
                                        validate: (value) => value !== undefined || "Designation is required",
                                    }}
                                    control={control}
                                    render={({field}) => (
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder="-- Select --"
                                            options={disciplines}
                                            optionLabel="name"
                                            optionValue="value"
                                            className={`w-100 ${errors.discipline && "p-invalid"}`}
                                            filter={true}
                                            filterBy="name"
                                        />
                                    )}
                                />
                            </div>
                            {errors.discipline && <span className="text-danger">{errors.discipline.message}</span>}
                        </div>
                    </div>
                </AddDataCard>
                <AddDataCard header="Personal Details" isSubDataCard={true}>
                    <div className='row'>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>First Name <span className='text-danger font-22'>*</span></label>
                                <InputText name='first_name' id='first_name' autoComplete='off'
                                           className={`w-100 ${errors.first_name && "p-invalid"}`} {...register('first_name', {
                                    required: {
                                        value: true,
                                        message: "First Name is required"
                                    },
                                })}/>
                            </div>
                            {errors.first_name && <span className="text-danger">{errors.first_name.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Middle Name <span className='text-danger font-22'></span></label>
                                <InputText name='middle_name' id='middle_name' autoComplete='off'
                                           className={`w-100 ${errors.middle_name && "p-invalid"}`} {...register('middle_name', {required: false})}/>
                            </div>
                            {errors.middle_name && <span className="text-danger">{errors.middle_name.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Last Name <span className='text-danger font-22'>*</span></label>
                                <InputText name='last_name' id='last_name' autoComplete='off'
                                           className={`w-100 ${errors.last_name && "p-invalid"}`} {...register('last_name', {
                                    required: {
                                        value: true,
                                        message: "Last Name is required"
                                    },
                                })}/>
                            </div>
                            {errors.last_name && <span className="text-danger">{errors.last_name.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Mobile <span className='text-danger font-22'>*</span></label>
                                <InputText name='mobile' id='mobile' autoComplete='off' keyfilter='int' maxLength={10}
                                           className={`w-100 ${errors.mobile && "p-invalid"}`} {...register('mobile', {
                                    required: {
                                        value: true,
                                        message: "Mobile number is required"
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: "Mobile number cannot exceed 10 digits"
                                    },
                                    minLength: {
                                        value: 10,
                                        message: "Mobile number must be at least 10 digits"
                                    },
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "Mobile number must contain only digits"
                                    }
                                })}/>
                            </div>
                            {errors.mobile && <span className="text-danger">{errors.mobile.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Email <span className='text-danger font-22'>*</span></label>
                                <InputText name='email' id='email' autoComplete='off' keyfilter='email'
                                           className={`w-100 ${errors.email && "p-invalid"}`} {...register('email', {
                                    required: {
                                        value: true,
                                        message: "Email is required"
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email address"
                                    }
                                })}/>
                            </div>
                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Date of Birth <span className='text-danger font-22'>*</span></label>
                                <Controller
                                    name="dob"
                                    control={control}
                                    rules={{
                                        required: "Date of birth is required"
                                    }}
                                    render={({field}) => (
                                        <Calendar
                                            id={field.name}
                                            value={field.value ? new Date(field.value) : null}
                                            onChange={(e) => {
                                                // Format date to YYYY-MM-DD before setting it
                                                const formattedDate = formatDate(e.value);
                                                field.onChange(formattedDate);
                                            }}
                                            dateFormat="dd/mm/yy"
                                            placeholder="dd/mm/yyyy"
                                            className={`w-100 ${errors.dob && "p-invalid"}`}
                                        />
                                    )}
                                />
                            </div>
                            {errors.dob && <span className="text-danger">{errors.dob.message}</span>}
                        </div>
                    </div>
                </AddDataCard>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddUser