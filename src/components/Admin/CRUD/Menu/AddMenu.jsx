import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {useForm} from "react-hook-form";
import axios from "axios";
import CookieHelper from "../../../../services/UseCookies.jsx";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {JWT_COOKIES_NAME} from "../../../../Util/AppConstant.jsx";


const AddMenu = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const toast = useRef(null);
    const navigate = useNavigate();
    const [icon, setIcon] = useState("");

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "Menu", url: '/admin/crud/menu'},
        {name: "Add Menu"}
    ];

    const {register, handleSubmit, formState: {errors}, setValue} = useForm();
    const onSubmitForm = (data) => {
        axios.post("crud/addMenu",
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
                    detail: 'Menu successfully created',
                    life: 3000
                });
                navigate("/admin/crud/menu");
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
                        <label>Menu Name*</label>
                        <InputText name='menu_name'
                                   className={`${errors.menu_name && 'p-invalid'} form-control`} {...register('menu_name', {required: true})}/>
                        {errors.menu_name && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4'>
                        <label>Menu Path*</label>
                        <InputText name='menu_path'
                                   className={`${errors.menu_path && 'p-invalid'} form-control`} {...register('menu_path', {required: true})}/>
                        {errors.menu_path && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4'>
                        <div className='row'>
                            <div className='col-md-10'>
                                <label>Menu Icon*</label>
                                <InputText name='menu_icon'
                                           className={`${errors.menu_icon && 'p-invalid'} form-control`} {
                                               ...register('menu_icon',
                                                   {
                                                       required: true,
                                                       onChange: (event) => {
                                                           setIcon(event.target.value)
                                                       }
                                                   })}/>
                                {errors.menu_icon && <span className='text-danger'>This field is required</span>}
                            </div>
                            <div className='col-md-2'>
                                <FontAwesomeIcon icon={icon} className="icon-pre"/>
                            </div>
                        </div>
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddMenu