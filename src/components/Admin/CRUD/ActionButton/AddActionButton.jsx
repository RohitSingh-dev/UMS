import AdminLayout from "../../AdminLayout.jsx";
import {InputText} from "primereact/inputtext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AddDataCard from "../AddDataCard.jsx";
import CookieHelper from "../../../../services/UseCookies.jsx";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import {JWT_COOKIES_NAME} from "../../../../Util/AppConstant.jsx";
import {useTranslation} from "react-i18next";

const AddActionButton = () => {
    const { t } = useTranslation();
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const toast = useRef(null);
    const navigate = useNavigate();
    const [icon, setIcon] = useState("");

    const breadcrumbData = [
        { name: t("actionButton.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("actionButton.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("actionButton.breadcrumb.action_button"), url: "/admin/crud/action-button" },
        { name: t("actionButton.breadcrumb.add_action_button") },
    ];

    const {register, handleSubmit, formState: {errors}, setValue} = useForm();
    const onSubmitForm = (data) => {
        axios.post("/crud/action-button/create",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                if (res.status === 201) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Menu successfully created',
                        life: 3000
                    });
                    navigate("/admin/crud/action-button");
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
                      <label>Action Button Name*</label>
                      <InputText name='action_name'
                                 className={`${errors.action_name && 'p-invalid'} form-control`} {...register('action_name', {required: true})}/>
                      {errors.action_name && <span className='text-danger'>This field is required</span>}
                  </div>
                  <div className='col-md-4'>
                      <label>Action Button Path*</label>
                      <InputText name='action_path'
                                 className={`${errors.action_path && 'p-invalid'} form-control`} {...register('action_path', {required: true})}/>
                      {errors.action_path && <span className='text-danger'>This field is required</span>}
                  </div>
                  <div className='col-md-4'>
                      <div className='row'>
                          <div className='col-md-10'>
                              <label>Action Button Icon*</label>
                              <InputText name='action_icon'
                                         className={`${errors.action_icon && 'p-invalid'} form-control`} {
                                             ...register('action_icon',
                                                 {
                                                     required: true,
                                                     onChange: (event) => {
                                                         setIcon(event.target.value)
                                                     }
                                                 })}/>
                              {errors.action_icon && <span className='text-danger'>This field is required</span>}
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

export default AddActionButton