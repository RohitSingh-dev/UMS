import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import AdminLayout from "../../AdminLayout.jsx";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import {useTranslation} from "react-i18next";

const AddDocumentType = () => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const navigate = useNavigate();

    const breadcrumbData = [
        { name: t("documentType.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("documentType.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("documentType.breadcrumb.document_type"), url: "/admin/crud/document-type" },
        { name: t("documentType.breadcrumb.add_document_type") },
    ];

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmitForm = (data) => {
        apiCall({
            url:'crud/add-document-type',
            data: data,
            showLoadingIndicator: false
        }).then((res) => {
                if (res.status === 200) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Document Type successfully created',
                        life: 3000
                    });
                    navigate("/admin/crud/document-type");
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
                      <label>Description*</label>
                      <InputText name='description'
                                 className={`${errors.description && 'p-invalid'} form-control`} {...register('description', {required: true})}/>
                      {errors.description && <span className='text-danger'>This field is required</span>}
                  </div>
                  <div className='col-md-4'>
                      <label>Type*</label>
                      <InputText name='document_type'
                                 className={`${errors.document_type && 'p-invalid'} form-control`} {...register('document_type', {required: true})}/>
                      {errors.document_type && <span className='text-danger'>This field is required</span>}
                  </div>
              </div>
          </AddDataCard>
      </AdminLayout>
  )
}

export default AddDocumentType