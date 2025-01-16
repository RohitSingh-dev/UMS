import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {useTranslation} from "react-i18next";

const AddDistrict = () => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const navigate = useNavigate();

    const breadcrumbData = [
        { name: t("district.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("district.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("district.breadcrumb.district"), url: "/admin/crud/district" },
        { name: t("district.breadcrumb.add_district") },
    ];

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmitForm = (data) => {
        apiCall({
            url:'crud/add-district',
            data: data,
            showLoadingIndicator: false
        }).then((res) => {
            if (res.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'District successfully created',
                    life: 3000
                });
                navigate("/admin/crud/district");
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
                    <div className='col-md-4'>
                        <label>Code*</label>
                        <InputText name='code'
                                   className={`${errors.code && 'p-invalid'} form-control`} {...register('code', {required: true})}/>
                        {errors.code && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4'>
                        <label>Name*</label>
                        <InputText name='name'
                                   className={`${errors.name && 'p-invalid'} form-control`} {...register('name', {required: true})}/>
                        {errors.name && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4'>
                        <label>Short Name*</label>
                        <InputText name='shortName'
                                   className={`${errors.document_type && 'p-invalid'} form-control`} {...register('shortName', {required: true})}/>
                        {errors.shortName && <span className='text-danger'>This field is required</span>}
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddDistrict