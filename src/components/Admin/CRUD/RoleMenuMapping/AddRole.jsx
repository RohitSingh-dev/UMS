import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import AdminLayout from "../../AdminLayout.jsx";
import CookieHelper from "../../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../../Util/AppConstant.jsx";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";

const AddRole = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const toast = useRef(null)
    const navigate = useNavigate()

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "Master Settings", url: '/admin/crud'},
        {name: "Role Menu Mapping", url: '/admin/crud/role-menu-mapping'},
        {name: "Add Role"}
    ];

    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmitForm = (data) => {
        axios.post("crud/addRole",
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
                        detail: 'Role successfully created',
                        life: 3000
                    });
                    navigate("/admin/crud/role-menu-mapping");
                }
            })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    return (
      <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
          <AddDataCard onSave={handleSubmit(onSubmitForm)}>
              <label>Role*</label>
              <InputText name='role'
                         className={`${errors.role && 'p-invalid'} form-control`} {...register('role', {required: true})}/>
              {errors.role && <span className='text-danger'>This field is required</span>}
          </AddDataCard>
      </AdminLayout>
  )
}

export default AddRole