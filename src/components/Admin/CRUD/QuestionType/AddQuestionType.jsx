import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {useForm} from "react-hook-form";
import axios from "axios";
import CookieHelper from "../../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../Util/AppConstant.jsx";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";


const AddQuestionType = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const toast = useRef(null)
    const navigate = useNavigate()

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "Question Type", url: '/admin/crud/question-types'},
        {name: "Add Question Type"}
    ];

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmitForm = (data) => {
        axios.post("crud/addQuestionType",
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
                        detail: 'Question type successfully created',
                        life: 3000
                    });
                    navigate("/admin/crud/question-types");
                }
            })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    }

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)}>
                <label>Question Type*</label>
                <InputText name='questionType'
                           className={`${errors.questionType && 'p-invalid'} form-control`} {...register('questionType', {required: true})}/>
                {errors.questionType && <span className='text-danger'>This field is required</span>}
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddQuestionType