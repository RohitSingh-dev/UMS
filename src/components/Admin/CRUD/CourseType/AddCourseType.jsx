import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {useForm} from "react-hook-form";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import apiCall from "../../../../Axios/APIHelper.jsx";


const AddCourseType = () => {
    const { t } = useTranslation();
    const toast = useRef(null)
    const navigate = useNavigate()

    const breadcrumbData = [
        { name: t("courseType.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("courseType.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("courseType.breadcrumb.courseType"), url: "/admin/crud/course-types" },
        { name: t("courseType.breadcrumb.addCourseType") },
    ];

    const {register, handleSubmit, formState: {errors}, reset} = useForm();

    const onSubmitForm = async (data) => {
        try {
            await apiCall({
                url: "/crud/course-type/add",
                method: "POST",
                data: data,
                showLoadingIndicator: true,
            }).then(response => {
                console.log(response);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Course Type successfully created.",
                    life: 3000,
                });

                // Reset form after submission
                reset();

                navigate("/admin/crud/course-types");
            });
        } catch (error) {
            console.error("Error creating program:", error);
            const errorMessage =
                error.response?.data?.message || "Failed to create the program. Please try again.";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: errorMessage,
                life: 3000,
            });
        }
    };

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)}>
                <div className="row">
                    <div className="col-4">
                    <label>{t("courseType.name")}*</label>
                        <InputText name='name'
                                className={`${errors.name && 'p-invalid'} form-control`} {...register('name', {required: true})}/>
                        {errors.name && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className="col-4">
                    <label>{t("courseType.shortName")}*</label>
                        <InputText name='shortName'
                                className={`${errors.shortName && 'p-invalid'} form-control`} {...register('shortName', {required: true})}/>
                        {errors.shortName && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className="col-4">
                    <label>{t("courseType.courseTypeCode")}*</label>
                        <InputText name='courseTypeCode'
                                className={`${errors.courseTypeCode && 'p-invalid'} form-control`} {...register('courseTypeCode', {required: true})}/>
                        {errors.courseTypeCode && <span className='text-danger'>This field is required</span>}
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    )
}

export default AddCourseType