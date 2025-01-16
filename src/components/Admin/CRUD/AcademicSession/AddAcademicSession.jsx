import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import moment from "moment/moment.js";
import {useTranslation} from "react-i18next";
import { Dropdown } from "primereact/dropdown";

const AddAcademicSession = () => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const navigate = useNavigate();
    const [programOptions, setProgramOptions] = useState([]);
    const [termOptions, setTermOptions] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [selectedMidTerm, setSelectedMidTerm] = useState(null);
    const [selectedEndTerm, setSelectedEndTerm] = useState(null);

    const breadcrumbData = [
        { name: t("academicSession.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("academicSession.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("academicSession.breadcrumb.academic_session"), url: "/admin/crud/academic-session" },
        { name: t("academicSession.breadcrumb.add_academic_session") },
    ];

    const {register, handleSubmit, control, formState: {errors}, reset} = useForm();
    
    useEffect(() => {
        apiCall({
          url: "/dropdown/program-offers",
          method: "GET",
          showLoadingIndicator: true,
        })
          .then((response) => {
            const programData = response.map((program) => ({
              label: program.name,
              value: program.value,
            }));
            setProgramOptions(programData);
          })
          .catch((error) => {
            console.error("Error fetching programs:", error);
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to fetch programs",
              life: 3000,
            });
          });
    
        apiCall({
          url: "/dropdown/terms",
          method: "GET",
          showLoadingIndicator: true,
        })
          .then((response) => {
            const termData = response.map((term) => ({
              label: term.name,
              value: term.value,
            }));
            setTermOptions(termData);
          })
          .catch((error) => {
            console.error("Error fetching streams:", error);
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to fetch streams",
              life: 3000,
            });
          });
    }, []);

    const onSubmitForm = (data) => {
        apiCall({
            url:'/crud/academic-session/add',
            method: 'POST',
            data: {...data, programOffer: selectedProgram, term: selectedTerm, status: selectedColumn, midTerm: selectedMidTerm, endTerm: selectedEndTerm },
            showLoadingIndicator: false
        }).then((res) => {
            console.log(res);
            
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Academic Session Successfully Created',
                life: 3000
            });
            reset();

            navigate("/admin/crud/academic-session");
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    const formatDate = (date) => {
        if (!date) return null;
        return moment(date).format('YYYY-MM-DD');
    };

    const columnOptions = [
        { label: 'Open', value: 'true' },
        { label: 'Close', value: 'false' }
    ];

    const midTermOptions = [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
    ];

    const endTermOptions = [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
    ];

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)} header='Details'>
                <div className='row'>
                    <div className='col-md-3'>
                        <label>{t("academicSession.academicSessionCode")}*</label>
                        <InputText name='academicSessionCode'
                                   className={`${errors.academicSessionCode && 'p-invalid'} form-control`} {...register('academicSessionCode', {required: true})}/>
                        {errors.academicSessionCode && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-3'>
                        <label>{t("academicSession.midTerm")}*</label>
                        <Controller
                            name="midTerm"
                            control={control}
                            render={() => (
                                <Dropdown
                                    value={selectedMidTerm}
                                    options={midTermOptions}
                                    onChange={(e) => setSelectedMidTerm(e.value)}
                                    placeholder="Select"
                                    optionLabel="label"
                                    className={`${errors.midTerm && "p-invalid"} w-100`}
                                />
                            )}
                        />
                    </div>
                    <div className='col-md-3'>
                        <label>{t("academicSession.endTerm")}*</label>
                        <Controller
                            name="endTerm"
                            control={control}
                            render={() => (
                                <Dropdown
                                    value={selectedEndTerm}
                                    options={endTermOptions}
                                    onChange={(e) => setSelectedEndTerm(e.value)}
                                    placeholder="Select"
                                    optionLabel="label"
                                    className={`${errors.endTerm && "p-invalid"} w-100`}
                                />
                            )}
                        />
                    </div>
                    <div className="col-md-3">
                            <label style={{lineHeight: "22px"}}>{t("academicSession.startDate")} <span className='text-danger font-22'>*</span></label>
                            <Controller
                                name="startDate"
                                control={control}
                                rules={{
                                    required: "Start Date is required"
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
                                        className={`w-100 ${errors.startDate && "p-invalid"}`}
                                        style={{height: "40px"}}
                                    />
                                )}
                            />
                        {errors.startDate && <span className="text-danger">{errors.startDate.message}</span>}
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-3">
                        <div>
                            <label style={{lineHeight: "22px"}}>{t("academicSession.endDate")}<span className='text-danger font-22'>*</span></label>
                            <Controller
                                name="endDate"
                                control={control}
                                rules={{
                                    required: "End Date is required"
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
                                        className={`w-100 ${errors.endDate && "p-invalid"}`}
                                        style={{height: "40px"}}
                                    />
                                )}
                            />
                        </div>
                        {errors.endDate && <span className="text-danger">{errors.endDate.message}</span>}
                    </div>
                    <div className="col-md-3">
                        <label>{t("academicSession.programOffer")}*</label>
                        <Controller
                            name="programOffer"
                            control={control}
                            render={() => (
                            <Dropdown
                                value={selectedProgram}
                                options={programOptions}
                                onChange={(e) => setSelectedProgram(e.value)}
                                placeholder="Select"
                                optionLabel="label"
                                filter
                                filterBy="label"
                                className={`w-100 ${errors.programOffer && "p-invalid"}`}
                            />
                            )}
                        />
                        {errors.programOffer && <span className="text-danger">{errors.programOffer.message}</span>}
                    </div>
                    <div className="col-md-3">
                        <label>{t("academicSession.termName")}*</label>
                        <Controller
                            name="term"
                            control={control}
                            render={() => (
                            <Dropdown
                                value={selectedTerm}
                                options={termOptions}
                                onChange={(e) => setSelectedTerm(e.value)}
                                placeholder="Select"
                                optionLabel="label"
                                filter
                                filterBy="label"
                                className={`w-100 ${errors.term && "p-invalid"}`}
                            />
                            )}
                        />
                        {errors.term && <span className="text-danger">{errors.term.message}</span>}
                    </div>
                    <div className='col-md-3'>
                        <label>{t("academicSession.status")}*</label>
                        <Controller
                            name="status"
                            control={control}
                            render={() => (
                                <Dropdown
                                    value={selectedColumn}
                                    options={columnOptions}
                                    onChange={(e) => setSelectedColumn(e.value)}
                                    placeholder="Select"
                                    optionLabel="label"
                                    className={`${errors.program && "p-invalid"} w-100`}
                                />
                            )}
                        />
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddAcademicSession