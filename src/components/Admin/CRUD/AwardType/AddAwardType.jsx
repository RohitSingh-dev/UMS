import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {useTranslation} from "react-i18next";

const AddAwardType = () => {
    const { t } = useTranslation();
    const toast = useRef(null)
    const navigate = useNavigate()

    const breadcrumbData = [
        { name: t("awardType.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("awardType.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("awardType.breadcrumb.award_type"), url: "/admin/crud/award-type" },
        { name: t("awardType.breadcrumb.add_award_type") },
    ];

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmitForm = (data) => {
        apiCall({
            url:'crud/add-award-type',
            data: data,
            showLoadingIndicator: false
        }).then((res) => {
            if (res.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Award Type successfully created',
                    life: 3000
                });
                navigate("/admin/crud/award-type");
            }
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }
    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)}>
                <label>Award Type*</label>
                <InputText name='name'
                           className={`${errors.name && 'p-invalid'} form-control`} {...register('name', {required: true})}/>
                {errors.name && <span className='text-danger'>This field is required</span>}
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddAwardType