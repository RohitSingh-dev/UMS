import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {Controller, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import apiCall from "../../../../Axios/APIHelper.jsx";
import {useTranslation} from "react-i18next";
import {Dropdown} from "primereact/dropdown";
import {useState, useEffect, useRef} from "react";
import {Calendar} from "primereact/calendar";
import moment from "moment/moment.js";


const AddStudentRegistration = () => {
    const {t} = useTranslation();
    const toast = useRef(null)
    const navigate = useNavigate()

    const breadcrumbData = [
        {name: t("student_registration.breadcrumb.dashboard"), url: '/admin/dashboard'},
        {name: t("student_registration.breadcrumb.crud"), url: '/admin/crud'},
        {name: t("student_registration.breadcrumb.student_registration"), url: '/admin/crud/student-registration'},
        {name: t("student_registration.breadcrumb.add_student_registration")},
    ];

    const {register, handleSubmit, control, formState: {errors}} = useForm();
    const [genderOptions, setGenders] = useState([]);
    const [bloodGroup, setBloodGroup] = useState([]);
    const [socialCategories, setSocialCategories] = useState([]);
    const [programOffer, setProgramOffer] = useState([]);
    const [batchOffer, setBatch] = useState([]);

    const formatDate = (date) => {
        if (!date) return null;
        return moment(date).format('YYYY-MM-DD');
    };

    useEffect(() => {
        apiCall({
            url: "/dropdown/disciplines",
            method: "GET",
            showLoadingIndicator: true,
        })
            .then((response) => {
                // Map API response to Dropdown format
                const programData = response.map((program) => ({
                    label: program.name, // Display name
                    value: program.value, // Actual value
                }));
                console.log(programData);
                setProgramOffer(programData);
            })
            .catch((error) => {
                console.error("Error fetching Program offer:", error);
                setProgramOffer([]);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch Program offer',
                    life: 3000,
                });
            });
    }, []);

    useEffect(() => {
        apiCall({
            url: "/dropdown/social-categories",
            method: "GET",
            showLoadingIndicator: true,
        })
            .then((response) => {
                // Map API response to Dropdown format
                const programData = response.map((program) => ({
                    label: program.name, // Display name
                    value: program.value, // Actual value
                }));
                console.log(programData);
                setSocialCategories(programData);
            })
            .catch((error) => {
                console.error("Error fetching social categories:", error);
                setProgramOffer([]);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch social categories',
                    life: 3000,
                });
            });
    }, []);

    useEffect(() => {
        apiCall({
            url: "/dropdown/batches",
            method: "GET",
            showLoadingIndicator: true,
        })
            .then((response) => {
                // Map API response to Dropdown format
                const programData = response.map((program) => ({
                    label: program.name, // Display name
                    value: program.value, // Actual value
                }));
                console.log(programData);
                setBatch(programData);
            })
            .catch((error) => {
                console.error("Error fetching batch:", error);
                setBatch([]);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch batch',
                    life: 3000,
                });
            });
    }, []);


    useEffect(() => {
        apiCall({
            url: "/dropdown/genders",
            method: "GET",
            showLoadingIndicator: true,
        })
            .then((response) => {
                // Map API response to Dropdown format
                const programData = response.map((program) => ({
                    label: program.name, // Display name
                    value: program.value, // Actual value
                }));
                console.log(programData);
                setGenders(programData);
            })
            .catch((error) => {
                console.error("Error fetching gender:", error);
                setGenders([]);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch gender',
                    life: 3000,
                });
            });
    }, []);

    useEffect(() => {
        apiCall({
            url: "/dropdown/blood-groups",
            method: "GET",
            showLoadingIndicator: true,
        })
            .then((response) => {
                // Map API response to Dropdown format
                const programData = response.map((program) => ({
                    label: program.name, // Display name
                    value: program.value, // Actual value
                }));
                console.log(programData);
                setBloodGroup(programData);
            })
            .catch((error) => {
                console.error("Error fetching blood group:", error);
                setGenders([]);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch blood group',
                    life: 3000,
                });
            });
    }, []);

    const statusMap = [
        {name: "Open", value: true},
        {name: "Close", value: false}
    ]


    const onSubmitForm = (data) => {
        console.log(data.firstName);

        const foramatedDate = {
            "firstName": data.firstName?.trim() === "" ? null : data.firstName,
            "username": data.username?.trim() === "" ? null : data.username,
            "mobile": data.gPhone?.trim() === "" ? null : data.gPhone,
            "email": data.pbsEmail?.trim() === "" ? null : data.pbsEmail,
            "nickName": data.nickName?.trim() === "" ? null : data.nickName,
            "fatherName": data.fatherName?.trim() === "" ? null : data.fatherName,
            "motherName": null,
            "bloodGroup": data.bloodGroup?.trim() === "" ? null : data.bloodGroup,
            "qualification": data.qualification?.trim() === "" ? null : data.qualification,
            "dateOfBirth": data.dateOfBirth?.trim() === "" ? null : data.dateOfBirth,
            "placeOfBirth": data.placeOfBirth?.trim() === "" ? null : data.placeOfBirth,
            "nationality": data.nationality?.trim() === "" ? null : data.nationality,
            "socialCategory": data.socialCategory?.trim() === "" ? null : data.socialCategory,
            "motherTongue": data.motherTongue?.trim() === "" ? null : data.motherTongue,
            "religion": null,
            "gender": data.gender?.trim() === "" ? null : data.gender,
            "admissionCategory": null,
            "sponsored": data.sponsored?.trim() === "" ? null : data.sponsored,
            "identificationMark": null,
            "aadharNumber": null,
            "passportNumber": null,
            "panNumber": null,
            "contactDetails": {
                "alternativeMail": data.altEmail?.trim() === "" ? null : data.altEmail,
                "alternativePhone": data.altPhone?.trim() === "" ? null : data.altPhone,
                "guardianName": data.gName?.trim() === "" ? null : data.gName,
                "guardianPhone": data.altPhone?.trim() === "" ? null : data.altPhone,
                "guardianMail": null,
                "address": [
                    {
                        "address1": data.cAddress1?.trim() === "" ? null : data.cAddress1,
                        "address2": data.cAddress2?.trim() === "" ? null : data.cAddress2,
                        "pin": data.cPin?.trim() === "" ? null : data.cPin,
                        "country": "USA",
                        "roomNo": data.roomNo?.trim() === "" ? null : data.roomNo,
                        "type": "PRESENT"
                    },
                    {
                        "address1": data.permanentAddress1?.trim() === "" ? null : data.permanentAddress1,
                        "address2": data.permanentAddress2?.trim() === "" ? null : data.permanentAddress2,
                        "pin": data.pPin?.trim() === "" ? null : data.pPin,
                        "country": "USA",
                        "roomNo": data.roomNo?.trim() === "" ? null : data.roomNo,
                        "type": "PERMANENT"
                    }
                ]
            },
            "workExperience": {
                "experienceInMonth": data.experienceInMonth?.trim() === "" ? null : data.experienceInMonth,
                "designation": data.designation?.trim() === "" ? null : data.designation,
                "companyName": data.companyName?.trim() === "" ? null : data.companyName,
                "companyAddress": {
                    "address1": data.companyAddress1?.trim() === "" ? null : data.companyAddress1,
                    "address2": data.companyAddress2?.trim() === "" ? null : data.companyAddress2,
                    "pin": data.companyPin?.trim() === "" ? null : data.companyPin,
                    "country": null,
                    "roomNo": null,
                    "type": null
                }
            },
            "courseDetails": {
                "section": data.section?.trim() === "" ? null : data.section,
                "spe1": data.sp1?.trim() === "" ? null : data.sp1,
                "spe2": data.sp2?.trim() === "" ? null : data.sp2,
                "discipline": data.discipline?.trim() === "" ? null : data.discipline,
                "batch": data.batch?.trim() === "" ? null : data.batch
            }
        }


        console.log(foramatedDate)

        apiCall({
            url: '/registration/create',
            data: foramatedDate,
            method: 'post',
            showLoadingIndicator: false
        }).then((res) => {
            console.log("success")
            toast.current.show({
                severity: t("student_registration.toast.success"),
                summary: t("student_registration.toast.success"),
                detail: t("student_registration.toast.successDetail"),
                life: 3000
            });
            navigate("/admin/crud/student-registration");
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)} isCard={false}>
                <AddDataCard isSubDataCard={true} header='Student Details'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.student_id")}*</label>
                            <InputText name='username'
                                       className={`${errors.username && 'p-invalid'} form-control`} {...register('username', {required: true})}/>
                            {errors.username && <span className='text-danger'>This field is required</span>}
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.first_name")}*</label>
                            <InputText name='firstName'
                                       className={`${errors.firstName && 'p-invalid'} form-control`} {...register('firstName', {required: true})}/>
                            {errors.firstName && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.last_name")}*</label>
                            <InputText name='lastName'
                                       className={`${errors.lastName && 'p-invalid'} form-control`} {...register('lastName', {required: true})}/>
                            {errors.lastName && <span className='text-danger'>This field is required</span>}
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.st_nick_name")}</label>
                            <InputText name='nickName'
                                       className={`${errors.nickName && 'p-invalid'} form-control`} {...register('nickName')}/>
                            {errors.nickName && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.father_name")}</label>
                            <InputText name='fatherName'
                                       className={`${errors.fatherName && 'p-invalid'} form-control`} {...register('fatherName')}/>
                            {errors.fatherName && <span className='text-danger'>This field is required</span>}
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.qualification")}</label>
                            <InputText name='qualification'
                                       className={`${errors.qualification && 'p-invalid'} form-control`} {...register('qualification')}/>
                            {errors.qualification && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className="col-md-6">
                            <label>{t("student_registration.blood_group")}</label>
                            <Controller
                                name="bloodGroup"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Dropdown
                                            value={field.value} // Bind value
                                            options={bloodGroup}
                                            onChange={(e) => field.onChange(e.value)} // Update react-hook-form state
                                            placeholder="Select"
                                            optionLabel="label"
                                            filter
                                            filterBy="label"
                                            className={`${fieldState.error ? "p-invalid" : ""} w-100`}
                                        />
                                        {fieldState.error && (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.date_of_birth")}</label>
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({field}) => (
                                    <Calendar
                                        id={field.name}
                                        value={field.value ? new Date(field.value) : null}
                                        onChange={(e) => {
                                            const formattedDate = formatDate(e.value);
                                            field.onChange(formattedDate);
                                        }}
                                        dateFormat="dd/mm/yy"
                                        placeholder="dd/mm/yyyy"
                                        className={`w-100 ${errors.dateOfBirth && "p-invalid"}`}
                                    />
                                )}
                            />
                            {errors.dateOfBirth && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.place_of_birth")}</label>
                            <InputText name='placeOfBirth'
                                       className={`${errors.placeOfBirth && 'p-invalid'} form-control`} {...register('placeOfBirth')}/>
                            {errors.placeOfBirth && <span className='text-danger'>This field is required</span>}
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.nationality")}</label>
                            <InputText name='nationality'
                                       className={`${errors.nationality && 'p-invalid'} form-control`} {...register('nationality', {required: false})}/>
                            {errors.nationality && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.category")}</label>
                            <Controller
                                name="socialCategory"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Dropdown
                                            value={field.value} // Bind value
                                            options={socialCategories}
                                            onChange={(e) => field.onChange(e.value)} // Update react-hook-form state
                                            placeholder="Select"
                                            optionLabel="label"
                                            filter
                                            filterBy="label"
                                            className={`${fieldState.error ? "p-invalid" : ""} w-100`}
                                        />
                                        {fieldState.error && (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.residential")}</label>
                            <InputText name='residential'
                                       className={`${errors.residential && 'p-invalid'} form-control`} {...register('residential', {required: false})}/>
                            {errors.questionType && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.mother_tongue")}</label>
                            <InputText name='motherTongue'
                                       className={`${errors.motherTongue && 'p-invalid'} form-control`} {...register('motherTongue', {required: false})}/>
                            {errors.motherTongue && <span className='text-danger'>This field is required</span>}
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.sponsored")}</label>
                            <InputText name='sponsored'
                                       className={`${errors.sponsored && 'p-invalid'} form-control`} {...register('sponsored', {required: false})}/>
                            {errors.sponsored && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.religion")}</label>
                            <InputText name='religion'
                                       className={`${errors.religion && 'p-invalid'} form-control`} {...register('religion', {required: false})}/>
                            {errors.religion && <span className='text-danger'>This field is required</span>}
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.sex")}*</label>
                            <Controller
                                name="gender"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Dropdown
                                            value={field.value} // Bind value
                                            options={genderOptions}
                                            onChange={(e) => field.onChange(e.value)} // Update react-hook-form state
                                            placeholder="Select"
                                            optionLabel="label"
                                            filter
                                            filterBy="label"
                                            className={`${fieldState.error ? "p-invalid" : ""} w-100`}
                                        />
                                        {fieldState.error && (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        )}
                                    </>
                                )}
                            />

                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.achievements")}</label>
                            <InputText name='achievements'
                                       className={`${errors.achievements && 'p-invalid'} form-control`} {...register('achievements')}/>
                            {errors.achievements && <span className='text-danger'>This field is required</span>}
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.hobbies")}</label>
                            <InputText name='hobbies'
                                       className={`${errors.hobbies && 'p-invalid'} form-control`} {...register('hobbies')}/>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.status")}*</label>
                            <Controller
                                name="status"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Dropdown
                                            value={field.value} // Bind value
                                            options={statusMap}
                                            onChange={(e) => field.onChange(e.value)} // Update react-hook-form state
                                            placeholder="Select"
                                            optionLabel="name"
                                            className={`${fieldState.error ? "p-invalid" : ""} w-100`}
                                        />
                                        {fieldState.error && (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </AddDataCard>
                <AddDataCard isSubDataCard={true} header='Course Details'>
                    <div className='row mt-3'>
                        <div className="col-md-6">
                            <label>{t("student_registration.section")}</label>
                            <InputText name='section'
                                       className={`${errors.section && 'p-invalid'} form-control`} {...register('section')}/>
                        </div>
                        <div className="col-md-6">
                            <label>{t("student_registration.discipline")}*</label>
                            <Controller
                                name="discipline"
                                control={control}
                                rules={{required: "Program Offer is required"}}
                                render={({field, fieldState}) => (
                                    <>
                                        <Dropdown
                                            value={field.value} // Bind value
                                            options={programOffer}
                                            onChange={(e) => field.onChange(e.value)} // Update react-hook-form state
                                            placeholder="Select"
                                            optionLabel="label"
                                            filter
                                            filterBy="label"
                                            className={`${fieldState.error ? "p-invalid" : ""} w-100`}
                                        />
                                        {fieldState.error && (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.area_specialization1")}</label>
                            <InputText name='spe1'
                                       className={`${errors.spe1 && 'p-invalid'} form-control`} {...register('spe1')}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.area_specialization2")}</label>
                            <InputText name='spe2'
                                       className={`${errors.spe2 && 'p-invalid'} form-control`} {...register('spe2')}/>
                        </div>
                    </div>
                    <div>
                        <div className='col-md-6 mt-3'>
                            <label>{t("student_registration.batch")}</label>
                            <Controller
                                name="batch"
                                control={control}
                                rules={{required: "batch is required"}}
                                render={({field, fieldState}) => (
                                    <>
                                        <Dropdown
                                            value={field.value} // Bind value
                                            options={batchOffer}
                                            onChange={(e) => field.onChange(e.value)} // Update react-hook-form state
                                            placeholder="Select"
                                            optionLabel="label"
                                            filter
                                            filterBy="label"
                                            className={`${fieldState.error ? "p-invalid" : ""} w-100`}
                                        />
                                        {fieldState.error && (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </AddDataCard>
                <AddDataCard isSubDataCard={true} header='Contact Details'>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.current_address")}</label>
                            <InputText name='cAddress1'
                                       className={`${errors.cAddress1 && 'p-invalid'} form-control`} {...register('cAddress1', {required: false})}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.city")}</label>
                            <InputText name='cAddress2'
                                       className={`${errors.cAddress2 && 'p-invalid'} form-control`} {...register('cAddress2', {required: false})}/>
                            {errors.cAddress2 && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.pin")}</label>
                            <InputText name='cPin'
                                       className={`${errors.cPin && 'p-invalid'} form-control`} {...register('cPin', {required: false})}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.pbs_email")}</label>
                            <InputText name='pbsEmail'
                                       className={`${errors.pbsEmail && 'p-invalid'} form-control`} {...register('pbsEmail', {required: false})}/>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.g_phone")}</label>
                            <InputText name='gPhone'
                                       className={`${errors.gPhone && 'p-invalid'} form-control`} {...register('gPhone', {required: true})}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.g_name")}</label>
                            <InputText name='gName'
                                       className={`${errors.gName && 'p-invalid'} form-control`} {...register('gName', {required: false})}/>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.alt_email")}</label>
                            <InputText name='altEmail'
                                       className={`${errors.altEmail && 'p-invalid'} form-control`} {...register('altEmail', {required: false})}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.state")}</label>
                            <InputText name='state'
                                       className={`${errors.state && 'p-invalid'} form-control`} {...register('state', {required: false})}/>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.permanent_address")}</label>
                            <InputText name='permanentAddress1'
                                       className={`${errors.permanentAddress1 && 'p-invalid'} form-control`} {...register('permanentAddress1', {required: false})}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.city_p")}</label>
                            <InputText name='pCity'
                                       className={`${errors.pCity && 'p-invalid'} form-control`} {...register('pCity', {required: false})}/>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.pin_p")}</label>
                            <InputText name='pPin'
                                       className={`${errors.pPin && 'p-invalid'} form-control`} {...register('pPin', {required: false})}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.phone_p")}</label>
                            <InputText name='altPhone'
                                       className={`${errors.altPhone && 'p-invalid'} form-control`} {...register('altPhone', {required: false})}/>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        {/* <div className='col-md-6'>
                  <label>{t("student_registration.phone_p")}</label>
                  <InputText name='altPhone'
                      className={`${errors.questionType && 'p-invalid'} form-control`} {...register('altPhone', {required: true})}/>
                </div>  */}
                        {/* <label>{t("student_registration.phone_p")}</label>
                <Controller
                    name="program"
                    control={control}
                    rules={{ required: "Program is required" }}
                    render={() => (
                        <Dropdown
                            value={selectedProgram}
                            options={programOptions}
                            onChange={(e) => setSelectedProgram(e.value)}
                            placeholder="Select"
                            optionLabel="label"
                            className={`${errors.program && "p-invalid"} w-100`}
                        />
                    )}
                />  */}
                    </div>
                </AddDataCard>
                <AddDataCard isSubDataCard={true} header='Experience Details'>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.designation")}</label>
                            <InputText name='designation'
                                       className={`${errors.designation && 'p-invalid'} form-control`} {...register('designation', {required: false})}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.company_name")}</label>
                            <InputText name='companyName'
                                       className={`${errors.companyName && 'p-invalid'} form-control`} {...register('companyName', {required: false})}/>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.company_address")}</label>
                            <InputText name='companyAddress1'
                                       className={`${errors.companyAddress1 && 'p-invalid'} form-control`} {...register('companyAddress1', {required: false})}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.city_company")}</label>
                            <InputText name='companyAddress2'
                                       className={`${errors.companyAddress2 && 'p-invalid'} form-control`} {...register('companyAddress2', {required: false})}/>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label>{t("student_registration.pin_company")}</label>
                            <InputText name='companyPin'
                                       className={`${errors.companyPin && 'p-invalid'} form-control`} {...register('companyPin', {required: false})}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t("student_registration.total_work_exp")}</label>
                            <InputText name='experienceInMonth' keyfilter="int"
                                       className={`${errors.experienceInMonth && 'p-invalid'} form-control`} {...register('experienceInMonth', {required: true})}/>
                        </div>
                    </div>
                    {/* <div className='row mt-3'>
                <div className='col-md-6'>
                  <label>{t("student_registration.pbs_co_cur_act")}</label>
                  <InputText name='pbsCoCurAct'
                      className={`${errors.questionType && 'p-invalid'} form-control`} {...register('name', {required: true})}/>
                </div>
                <div className='col-md-6'>
                  <label>{t("student_registration.pbs_co_email")}</label>
                  <InputText name='pbsCoEmail'
                      className={`${errors.questionType && 'p-invalid'} form-control`} {...register('streamId', {required: true})}/>
                  {errors.questionType && <span className='text-danger'>This field is required</span>}
                </div>
              </div> */}
                    <div className='row mt-3'>
                        {/* <div className='col-md-6'>
                  <label>{t("student_registration.pbs_co_webpage")}</label>
                  <InputText name='pbsCoWebpage'
                      className={`${errors.questionType && 'p-invalid'} form-control`} {...register('name', {required: true})}/>
                </div> */}
                        {/* <div className='col-md-6'>
                  <label>{t("student_registration.hobbies")}</label>
                  <InputText name='hobbies'
                      className={`${errors.questionType && 'p-invalid'} form-control`} {...register('streamId', {required: true})}/>
                  {errors.questionType && <span className='text-danger'>This field is required</span>}
                </div> */}
                    </div>
                </AddDataCard>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddStudentRegistration;