import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {useTranslation} from "react-i18next";

const AddActivityMasterList = () => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const navigate = useNavigate();
    const [paperId, setPaperId] = useState([]);

    const breadcrumbData = [
        { name: t("activityMasterList.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("activityMasterList.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("activityMasterList.breadcrumb.activity_master_list"), url: "/admin/crud/activity-master-list" },
        { name: t("activityMasterList.breadcrumb.activity_master_list") },
    ];

    const activityType = [
        {name: "INTERNAL_THEORY", value: "internal_theory"},
        {name: "INTERNAL_PRACTICAL", value: "internal_practical"}
    ]

    const {register, handleSubmit, control,  formState: {errors}} = useForm();
    const onSubmitForm = (data) => {
        apiCall({
            url:'crud/add-activity-master-list',
            data: data,
            showLoadingIndicator: false
        }).then((res) => {
            if (res.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Activity Master List Successfully Created',
                    life: 3000
                });
                navigate("/admin/crud/activity-master-list");
            }
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)} header='Details'>
                <div className='row'>
                    <div className='col-md-6'>
                        <label>Activity Id*</label>
                        <InputText name='activity_id'
                                   className={`${errors.activity_id && 'p-invalid'} form-control`} {...register('activity_id', {required: true})}/>
                        {errors.activity_id && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-6'>
                        <label>Full Marks*</label>
                        <InputText name='full_marks'
                                   className={`${errors.full_marks && 'p-invalid'} form-control`} {...register('full_marks', {required: true})}/>
                        {errors.full_marks && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className="col-md-6 mt-4">
                        <div className="form-group gap-0">
                            <label className="font-weight-normal" style={{fontSize: '16px'}}>Activity Type*</label>
                            <Controller
                                name="activity_type"
                                control={control}
                                render={({field}) => (
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        placeholder="-- Select --"
                                        options={activityType}
                                        optionLabel="name"
                                        optionValue="value"
                                        className={`w-100 ${errors.activity_type && "p-invalid"}`}
                                        filter={true}
                                        filterBy="name"
                                    />
                                )}
                            />
                        </div>
                        {errors.activity_type && <span className="text-danger">{errors.activity_type.message}</span>}
                    </div>
                    <div className="col-md-6 mt-4">
                        <div className="form-group gap-0">
                            <label className="font-weight-normal" style={{fontSize: '16px'}}>Paper Id*</label>
                            <Controller
                                name="paper_id"
                                control={control}
                                render={({field}) => (
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        placeholder="-- Select --"
                                        options={paperId}
                                        optionLabel="name"
                                        optionValue="value"
                                        className={`w-100 ${errors.paper_id && "p-invalid"}`}
                                        filter={true}
                                        filterBy="name"
                                    />
                                )}
                            />
                        </div>
                        {errors.paper_id && <span className="text-danger">{errors.paper_id.message}</span>}
                    </div>
                    <div className='col-md-6 mt-2'>
                        <label>Paper Code*</label>
                        <InputText name='paper_code'
                                   className={`${errors.paper_code && 'p-invalid'} form-control`} {...register('paper_code', {required: true})}/>
                        {errors.paper_code && <span className='text-danger'>This field is required</span>}
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddActivityMasterList