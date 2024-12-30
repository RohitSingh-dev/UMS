import CookieHelper from "../../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../../Util/AppConstant.jsx";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";

const AddSocialCategory = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const toast = useRef(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const navigate = useNavigate();

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "Social Category", url: '/admin/crud/social-category'},
        {name: "Add Social Category"}
    ];

    const columnOptions = [
        { label: 'YES', value: 'true' },
        { label: 'NO', value: 'false' }
    ];

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmitForm = (data) => {
        axios.post("crud/add-social-category",
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
                        detail: 'Social Category successfully created',
                        life: 3000
                    });
                    navigate("/admin/crud/social-category");
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
                        <label>Name*</label>
                        <InputText name='name'
                                   className={`${errors.name && 'p-invalid'} form-control`} {...register('name', {required: true})}/>
                        {errors.name && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-6'>
                        <label>Is Certificate Required*</label>
                        <Dropdown
                            value={selectedColumn}
                            options={columnOptions}
                            onChange={(e) => {
                                setSelectedColumn(e.value);
                            }}
                            placeholder="Select" optionLabel="label"
                        />
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddSocialCategory