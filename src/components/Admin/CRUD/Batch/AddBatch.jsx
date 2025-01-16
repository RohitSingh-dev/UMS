import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import {useTranslation} from "react-i18next";


const AddBatch = () => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const navigate = useNavigate();
    const [date, setDate] = useState(null);

    const breadcrumbData = [
        { name: t("batch.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("batch.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("batch.breadcrumb.batch"), url: "/admin/crud/batch" },
        { name: t("batch.breadcrumb.add_batch") },
    ];
    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmitForm = (data) => {
        apiCall({
            url:'crud/add-batch',
            data: data,
            showLoadingIndicator: false
        }).then((res) => {
            if (res.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Batch Successfully Created',
                    life: 3000
                });
                navigate("/admin/crud/batch");
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
                    <div className='col-md-8'>
                        <label>Name*</label>
                        <InputText name='name'
                                   className={`${errors.name && 'p-invalid'} form-control`} {...register('name', {required: true})}/>
                        {errors.name && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4 d-flex flex-column'>
                        <label>Year*</label>
                        <Calendar value={date}
                                  onChange={(e) => setDate(e.value)}
                                  view="year" dateFormat="yy" style={{height: "40px"}} />
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddBatch