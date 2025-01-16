import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import apiCall from "../../../../Axios/APIHelper.jsx";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import {InputText} from "primereact/inputtext";
import {useTranslation} from "react-i18next";

const AddProgram = () => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const navigate = useNavigate();

    const breadcrumbData = [
        { name: t("program.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("program.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("program.breadcrumb.program"), url: "/admin/crud/program" },
        { name: t("program.breadcrumb.add_program") },
    ];

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        // Reset the form when the component is unmounted
        return () => {
            reset();
        };
    }, []);

    const onSubmitForm = async (data) => {
        try {
            await apiCall({
                url: "/crud/program/add",
                method: "POST",
                data: data,
                showLoadingIndicator: true,
            }).then(response => {
                console.log(response);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Program successfully created.",
                    life: 3000,
                });

                // Reset form after submission
                reset();

                navigate("/admin/crud/program");
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
            <AddDataCard onSave={handleSubmit(onSubmitForm)} header='Details'>
                <div className='row'>
                    <div className='col-md-4'>
                        <label>Long Name*</label>
                        <InputText name='longName'
                            className={`${errors.longName && 'p-invalid'} form-control`} {...register('longName', { required: true })} />
                        {errors.longName && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4'>
                        <label>Name*</label>
                        <InputText name='name'
                            className={`${errors.name && 'p-invalid'} form-control`} {...register('name', { required: true })} />
                        {errors.name && <span className='text-danger'>This field is required</span>}
                    </div>
                    <div className='col-md-4'>
                        <label>Program Code*</label>
                        <InputText name='programCode'
                            className={`${errors.programCode && 'p-invalid'} form-control`} {...register('programCode', { required: true })} />
                        {errors.programCode && <span className='text-danger'>This field is required</span>}
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    );
};

export default AddProgram;
