import { useRef, useState, useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import moment from "moment/moment.js";
import { Dropdown } from "primereact/dropdown";
import {useTranslation} from "react-i18next";

const AddProgramOffer = () => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const navigate = useNavigate();
    const [programOptions, setProgramOptions] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const location = useLocation();
    const [formData, setFormData] = useState(location.state || {});

    useEffect(() => {
        console.log("Form Data: ", formData);
    },[])

    const breadcrumbData = [
        { name: t("programOffer.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("programOffer.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("programOffer.breadcrumb.program_offer"), url: "/admin/crud/program-offer" },
        { name: t("programOffer.breadcrumb.add_program_offer") },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const formatDate = (date) => {
        if (!date) return null;
        return moment(date).format('YYYY-MM-DD');
    };

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm();

    useEffect(() => {
        apiCall({
            url: "/dropdown/programs",
            method: "GET",
            showLoadingIndicator: true,
        })
            .then((response) => {
                // Map API response to Dropdown format
                const programData = response.map((program) => ({
                    label: program.name, // Display name
                    value: program.value, // Actual value
                }));
                setProgramOptions(programData);
            })
            .catch((error) => {
                console.error("Error fetching programs:", error);
                setProgramOptions([]);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch programs',
                    life: 3000,
                });
            });
    }, []);  

    const onSubmitForm = (data) => {
        apiCall({
            url: "/crud/program-offer/add",
            method: "POST",
            data: { ...data, program: selectedProgram, status: selectedColumn },
            showLoadingIndicator: false
        }).then((res) => {
            console.log(res);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Program Offer successfully created',
                life: 3000
            });
            reset();
            navigate("/admin/crud/program-offer");
        })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data, life: 3000 });
            });
    };

    const columnOptions = [
        { label: 'Open', value: 'true' },
        { label: 'Close', value: 'false' }
    ];

    useEffect(() => {
        // Convert formData.status to a string and find the matching option
        if (formData.status !== undefined) {
            const statusAsString = String(formData.status); // Convert boolean to string
            const matchingOption = columnOptions.find(option => option.value === statusAsString);
            setSelectedColumn(matchingOption); // Set the matching option
        }
    }, [formData.status]);

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)} header={formData.id ? 'Edit Record' : 'Add Record'}>
                <div className='row'>
                <div className="col-md-4">
                        <div className="form-group gap-0">
                            <label>Program Name*</label>
                            <Controller
                                name="program"
                                control={control}
                                render={() => (
                                    <Dropdown
                                        value={formData["program.name"] || selectedProgram}
                                        options={programOptions}
                                        onChange={(e) => {
                                            setFormData((prev) => ({ ...prev, program: e.value })); // Update formData
                                            setSelectedProgram(e.value); // Update selectedProgram for other cases
                                        }}
                                        placeholder="Select"
                                        optionLabel="label"
                                        className={`${errors.program && "p-invalid"} w-100`}
                                    />
                                )}
                            />
                        </div>
                        {errors.program && <span className="text-danger">{errors.program.message}</span>}
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group gap-0">
                            <label>Program Offer Code*</label>
                            <InputText
                                name='programOfferCode'
                                className={`${errors.programOfferCode && 'p-invalid'} form-control`}
                                {...register('programOfferCode', { required: true })}
                                style={{height: "50px"}}
                                value={formData.programOfferCode || ''}
                                onChange={handleChange}
                            />
                            {errors.programOfferCode && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group gap-0">
                            <label>Start Date *</label>
                            <Controller
                                name="startDate"
                                control={control}
                                rules={{ required: "Start Date is required" }}
                                render={({ field }) => (
                                    <Calendar
                                        id={field.name}
                                        value={formData.startDate ? moment(formData.startDate, 'DD-MM-YYYY').toDate() : null}
                                        onChange={(e) => {
                                            const formattedDate = moment(e.value).format('DD-MM-YYYY'); // Format to DD-MM-YYYY
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                startDate: formattedDate, // Update formData
                                            }));
                                            field.onChange(formattedDate); // Update Controller value
                                        }}
                                        dateFormat="dd/mm/yy"
                                        placeholder="dd/mm/yyyy"
                                        className={`w-100 ${errors.startDate && "p-invalid"}`}
                                    />
                                )}
                            />
                            {errors.startDate && <span className="text-danger">{errors.startDate.message}</span>}
                        </div>
                    </div>
                    <div className='col-md-4 mt-3'>
                        <div className="form-group gap-0">
                            <label>End Date *</label>
                            <Controller
                                name="endDate"
                                control={control}
                                rules={{ required: "End Date is required" }}
                                render={({ field }) => (
                                    <Calendar
                                        id={field.name}
                                        value={formData.endDate ? moment(formData.endDate, 'DD-MM-YYYY').toDate() : null}
                                        onChange={(e) => {
                                            const formattedDate = moment(e.value).format('DD-MM-YYYY'); // Format to DD-MM-YYYY
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                endDate: formattedDate, // Update formData
                                            }));
                                            field.onChange(formattedDate); // Update Controller value
                                        }}
                                        dateFormat="dd/mm/yy"
                                        placeholder="dd/mm/yyyy"
                                        className={`w-100 ${errors.endDate && "p-invalid"}`}
                                    />
                                )}
                            />
                            {errors.endDate && <span className="text-danger">{errors.endDate.message}</span>}
                        </div>
                    </div>
                    <div className='col-md-4 mt-3'>
                        <div className="form-group gap-0">
                            <label>Status*</label>
                            <Controller
                                name="status"
                                control={control}
                                render={() => (
                                    <Dropdown
                                        value={selectedColumn}
                                        options={columnOptions}
                                        onChange={(e) => {
                                            setSelectedColumn(e.value); // Update the selected column
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                status: e.value.value === 'true',
                                            }));
                                        }}
                                        placeholder="Select"
                                        optionLabel="label"
                                        className={`${errors.status && "p-invalid"} w-100`}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    );
};

export default AddProgramOffer;
