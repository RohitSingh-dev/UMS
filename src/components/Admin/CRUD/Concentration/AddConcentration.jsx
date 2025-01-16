import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import CookieHelper from "../../../../services/UseCookies.jsx";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JWT_COOKIES_NAME } from "../../../../Util/AppConstant.jsx";
import apiCall from "../../../../Axios/APIHelper.jsx";
import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";

const AddConcentration = () => {
    const { t } = useTranslation();
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const toast = useRef(null);
    const navigate = useNavigate();
    const [specializationOptions, setSpecializationOptions] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState(null);

    const breadcrumbData = [
        { name: t("concentration.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("concentration.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("concentration.breadcrumb.concentration"), url: "/admin/crud/concentration" },
        { name: t("concentration.breadcrumb.add_concentration") },
    ];

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm();

    useEffect(() => {
        apiCall({
            url: "/dropdown/specializations",
            method: "GET",
            showLoadingIndicator: true,
        })
            .then((response) => {
                const specializationData = response.map((specialization) => ({
                    label: specialization.name,
                    value: specialization.value,
                }));
                setSpecializationOptions(specializationData);
            })
            .catch((error) => {
                console.error("Error fetching streams:", error);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to fetch streams",
                    life: 3000,
                });
            });
    }, []);

    const onSubmitForm = (data) => {
        apiCall({
            url: "/crud/concentration/add",
            data: { ...data, specialization: selectedSpecialization },
            method: "post",
            showLoadingIndicator: false,
        })
            .then((res) => {
                toast.current.show({
                    severity: "success",
                    summary: t("concentration.toast.success"),
                    detail: t("concentration.toast.successDetail"),
                    life: 3000,
                });
                reset();
                navigate("/admin/crud/concentration");
            })
            .catch((error) => {
                toast.current.show({
                    severity: "error",
                    summary: t("concentration.toast.error"),
                    detail: error.response?.data || t("concentration.toast.genericError"),
                    life: 3000,
                });
            });
    };

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)} header={t("concentration.header")}>
                <div className="row">
                    <div className="col-md-6">
                        <label>{t("concentration.name")}*</label>
                        <InputText
                            name="name"
                            className={`${errors.name && "p-invalid"} form-control`}
                            {...register("name", { required: true })}
                        />
                        {errors.name && (
                            <span className="text-danger">{t("validationMessages.required", { field: t("concentration.name") })}</span>
                        )}
                    </div>
                    <div className="col-md-6">
                        <label>{t("concentration.connection_code")}*</label>
                        <InputText
                            name="concentrationCode"
                            className={`${errors.concentrationCode && "p-invalid"} form-control`}
                            {...register("concentrationCode", { required: true })}
                        />
                        {errors.concentrationCode && (
                            <span className="text-danger">{t("validationMessages.required", { field: t("concentration.connection_code") })}</span>
                        )}
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <label>{t("concentration.specializationName")}*</label>
                        <Controller
                            name="specialization"
                            control={control}
                            render={() => (
                                <Dropdown
                                    value={selectedSpecialization}
                                    options={specializationOptions}
                                    onChange={(e) => setSelectedSpecialization(e.value)}
                                    placeholder="Select"
                                    optionLabel="label"
                                    filter
                                    filterBy="label"
                                    className={`w-100 ${errors.stream && "p-invalid"}`}
                                />
                            )}
                        />
                        {errors.stream && <span className="text-danger">{errors.stream.message}</span>}
                    </div>
                </div>
            </AddDataCard>
        </AdminLayout>
    );
};

export default AddConcentration;
