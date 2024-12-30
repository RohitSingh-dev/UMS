import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import AdminLayout from "../../AdminLayout.jsx";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";

const AddReligion = () => {
    const toast = useRef(null)
    const navigate = useNavigate()

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "Religion", url: '/admin/crud/religion'},
        {name: "Add Religion"}
    ];

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmitForm = (data) => {
        apiCall({
            url:'crud/addReligion',
            data: data,
            showLoadingIndicator: false
        }).then((res) => {
                if (res.status === 200) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Religion successfully created',
                        life: 3000
                    });
                    navigate("/admin/crud/religion");
                }
            })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }
    return (
      <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
          <AddDataCard onSave={handleSubmit(onSubmitForm)}>
              <label>Religion*</label>
              <InputText name='religion'
                         className={`${errors.religion && 'p-invalid'} form-control`} {...register('religion', {required: true})}/>
              {errors.religion && <span className='text-danger'>This field is required</span>}
          </AddDataCard>
      </AdminLayout>
  )
}

export default AddReligion