import {useTranslation} from "react-i18next";
import CookieHelper from "../../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../../Util/AppConstant.jsx";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";

const AddState = () => {
    const { t } = useTranslation();
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const toast = useRef(null);
    const navigate = useNavigate();

    const breadcrumbData = [
        { name: t("state.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("state.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("state.breadcrumb.state"), url: "/admin/crud/state" },
        { name: t("state.breadcrumb.add_state") },
    ];

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmitForm = (data) => {
        axios.post("crud/add-state",
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
                        detail: 'State Successfully Created',
                        life: 3000
                    });
                    navigate("/admin/crud/state");
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
                                   className={`${errors.shortName && 'p-invalid'} form-control`} {...register('shortName', {required: true})}/>
                        {errors.shortName && <span className='text-danger'>This field is required</span>}
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddState