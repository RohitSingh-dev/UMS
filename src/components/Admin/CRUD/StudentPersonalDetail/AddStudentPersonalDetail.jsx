import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {Controller, useForm} from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import moment from "moment/moment.js";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";

const AddStudentPersonalDetail = () => {
    const toast = useRef(null)
    const navigate = useNavigate()
    const genders = useSelector((state) => state.selectTagOptions.genders);
    const maritalStatus = useSelector((state) => state.selectTagOptions.maritalStatus);
    const nationality = useSelector((state) => state.selectTagOptions.nationality);
    const motherTongues = useSelector((state) => state.selectTagOptions.motherTongues);
    const bloodGroups = useSelector((state) => state.selectTagOptions.bloodGroups);

    const {register, handleSubmit, control, formState: {errors}} = useForm();

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "Master Settings", url: '/admin/crud'},
        {name: "Student Personal Details", url: '/admin/crud/student-personal-details'},
        {name: "Add Student Personal Details"}
    ];

    const onSubmitForm = (data) => {
        apiCall({
            url: "crud/student-personal-details/create",
            data: data,
            method: 'post',
            showLoadingIndicator: false
        }).then(() => {
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Student Personal Details Successfully Created',
                life: 3000
            });
            setTimeout(() => {
                navigate("/admin/crud/student-personal-details");
            }, 3000)
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
                <AddDataCard header='Personal Details' isSubDataCard={true}>
                    <div className='row'>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Father Name <span className='text-danger font-22'>*</span></label>
                                <InputText name='father_name' id='father_name' autoComplete='off'
                                           className={`w-100 ${errors.father_name && "p-invalid"}`} {...register('father_name', {
                                    required: {
                                        value: true,
                                        message: "Father Name is required"
                                    },
                                })}/>
                            </div>
                            {errors.father_name && <span className="text-danger">{errors.father_name.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Mother Name <span className='text-danger font-22'>*</span></label>
                                <InputText name='mother_name' id='mother_name' autoComplete='off'
                                           className={`w-100 ${errors.mother_name && "p-invalid"}`} {...register('mother_name', {
                                    required: {
                                        value: true,
                                        message: "Mother Name is required"
                                    },
                                })}/>
                            </div>
                            {errors.mother_name && <span className="text-danger">{errors.mother_name.message}</span>}
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
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Gender <span className='text-danger font-22'>*</span></label>
                                <Controller
                                    name="gender"
                                    rules={{
                                        validate: (value) => value !== undefined || "Gender is required",
                                    }}
                                    control={control}
                                    render={({field}) => (
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder="-- Select --"
                                            options={genders}
                                            optionLabel="name"
                                            optionValue="value"
                                            className={`w-100 ${errors.gender && "p-invalid"}`}
                                            filter={true}
                                            filterBy="name"
                                        />
                                    )}
                                />
                            </div>
                            {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Aadhar Number <span className='text-danger font-22'>*</span></label>
                                <InputText name='aadhar_number' id='aadhar_number' autoComplete='off'
                                           className={`w-100 ${errors.aadhar_number && "p-invalid"}`} {...register('aadhar_number', {
                                    required: {
                                        value: true,
                                        message: "Aadhar Number is required"
                                    },
                                })}/>
                            </div>
                            {errors.aadhar_number && <span className="text-danger">{errors.aadhar_number.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Pan Number <span className='text-danger font-22'>*</span></label>
                                <InputText name='pan_number' id='pan_number' autoComplete='off'
                                           className={`w-100 ${errors.pan_number && "p-invalid"}`} {...register('pan_number', {
                                    required: {
                                        value: true,
                                        message: "Pan Number is required"
                                    },
                                })}/>
                            </div>
                            {errors.pan_number && <span className="text-danger">{errors.pan_number.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Passport Number <span className='text-danger font-22'></span></label>
                                <InputText name='passport_number' id='passport_number' autoComplete='off'
                                           className={`w-100 ${errors.passport_number && "p-invalid"}`} {...register('passport_number', {
                                    validate: value => value === '' || /^[A-Z0-9]+$/.test(value) || "Invalid passport number"
                                })}/>
                            </div>
                            {errors.passport_number && <span className="text-danger">{errors.passport_number.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Nationality <span className='text-danger font-22'>*</span></label>
                                <Controller
                                    name="nationality"
                                    rules={{
                                        validate: (value) => value !== undefined || "Nationality is required",
                                    }}
                                    control={control}
                                    render={({field}) => (
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder="-- Select --"
                                            options={nationality}
                                            optionLabel="name"
                                            optionValue="value"
                                            className={`w-100 ${errors.nationality && "p-invalid"}`}
                                            filter={true}
                                            filterBy="name"
                                        />
                                    )}
                                />
                            </div>
                            {errors.nationality && <span className="text-danger">{errors.nationality.message}</span>}
                        </div>
                    </div>
                </AddDataCard>
                <AddDataCard header="Additional Details" isSubDataCard={true}>
                    <div className='row'>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Marital Status <span className='text-danger font-22'></span></label>
                                <Controller
                                    name="marital_status"
                                    control={control}
                                    render={({field}) => (
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder="-- Select --"
                                            options={maritalStatus}
                                            optionLabel="name"
                                            optionValue="value"
                                            className={`w-100 ${errors.marital_status && "p-invalid"}`}
                                            filter={true}
                                            filterBy="name"
                                        />
                                    )}
                                />
                            </div>
                            {errors.marital_status && <span className="text-danger">{errors.marital_status.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Spouse Name <span className='text-danger font-22'></span></label>
                                <InputText name='spouse_name' id='spouse_name' autoComplete='off'
                                           className={`w-100 ${errors.spouse_name && "p-invalid"}`}/>
                            </div>
                            {errors.spouse_name && <span className="text-danger">{errors.spouse_name.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Mother Tongue <span className='text-danger font-22'></span></label>
                                <Controller
                                    name="mother_tongue"
                                    control={control}
                                    render={({field}) => (
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder="-- Select --"
                                            options={motherTongues}
                                            optionLabel="name"
                                            optionValue="value"
                                            className={`w-100 ${errors.mother_tongue && "p-invalid"}`}
                                            filter={true}
                                            filterBy="name"
                                        />
                                    )}
                                />
                            </div>
                            {errors.mother_tongue && <span className="text-danger">{errors.mother_tongue.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Blood Group <span className='text-danger font-22'></span></label>
                                <Controller
                                    name="blood_group"
                                    control={control}
                                    render={({field}) => (
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder="-- Select --"
                                            options={bloodGroups}
                                            optionLabel="name"
                                            optionValue="value"
                                            className={`w-100 ${errors.blood_group && "p-invalid"}`}
                                            filter={true}
                                            filterBy="name"
                                        />
                                    )}
                                />
                            </div>
                            {errors.blood_group && <span className="text-danger">{errors.blood_group.message}</span>}
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Identification Mark <span className='text-danger font-22'></span></label>
                                <InputText name='identification_mark' id='identification_mark' autoComplete='off'
                                           className={`w-100 ${errors.identification_mark && "p-invalid"}`} />
                            </div>
                            {errors.identification_mark && <span className="text-danger">{errors.identification_mark.message}</span>}
                        </div>
                    </div>
                </AddDataCard>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddStudentPersonalDetail