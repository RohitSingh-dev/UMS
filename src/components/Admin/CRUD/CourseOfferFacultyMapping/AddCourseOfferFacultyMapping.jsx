import {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { JWT_COOKIES_NAME } from "../../../../Util/AppConstant.jsx";
import CookieHelper from "../../../../services/UseCookies.jsx";
import axios from "axios";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import { MultiSelect } from "primereact/multiselect";
import apiCall from "../../../../Axios/APIHelper.jsx";

const AddCourseOfferFacultyMapping = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const toast = useRef(null);
    const [courseOffers, setCourseOffers] = useState([])
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Breadcrumb Data
    const breadcrumbData = [
        { name: t("courseOfferFacultyMapping.breadcrumb.dashboard"), url: "/admin/dashboard" },
        { name: t("courseOfferFacultyMapping.breadcrumb.crud"), url: "/admin/crud" },
        { name: t("courseOfferFacultyMapping.breadcrumb.course_offer_faculty_mapping"), url: "/admin/crud/course-offer-faculty-mapping" },
        { name: t("courseOfferFacultyMapping.breadcrumb.add_course_offer_faculty_mapping") },
    ];

    const { handleSubmit, control, formState: { errors } } = useForm();

    useEffect(()=>{
        apiCall({
            url: '/dropdown/course-offers',
            showLoadingIndicator: false
        }).then((res) => {
            setCourseOffers(res)
        })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
            })
    },[])

    // General Dropdown Field Component
    const renderDropdownField = (name, label, options) => (
        <div className="mb-3 col-md-4">
            <label>{t(`courseOfferFacultyMapping.${label}`)}*</label>
            <Controller
                name={name}
                rules={{ required: t("validationMessages.required", { field: t(`courseOfferFacultyMapping.${label}`) }) }}
                control={control}
                render={({ field }) => (
                    <Dropdown
                        id={field.name}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder="-- Select --"
                        options={options}
                        optionLabel="name"
                        optionValue="value"
                        className={`w-100 ${errors[name] && "p-invalid"}`}
                        filter
                        filterBy="label"
                    />
                )}
            />
            {errors[name] && <span className="text-danger">{errors[name].message}</span>}
        </div>
    );

    const renderMultiSelectField = (name, label, options) => (
        <div className="mb-3 col-md-4">
            <label>{t(`courseOfferFacultyMapping.${label}`)}*</label>
            <Controller
                name={name}
                rules={{ required: t("validationMessages.required", { field: t(`courseOfferFacultyMapping.${label}`) }) }}
                control={control}
                render={({ field }) => (
                    <MultiSelect
                        id={field.name}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder="-- Select --"
                        options={options}
                        optionLabel="name"
                        optionValue="value"
                        className={`w-100 ${errors[name] && "p-invalid"}`}
                        display="chip"
                    />
                )}
            />
            {errors[name] && <span className="text-danger">{errors[name].message}</span>}
        </div>
    );

    // TODO: Need to add Submit Form Logic
    const onSubmitForm = async (data) => {
        try {
            const res = await axios.post("crud/add-document-type", data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                toast.current.show({
                    severity: "success",
                    summary: t("toast.success"),
                    detail: t("toast.documentTypeCreated"),
                    life: 3000,
                });
                navigate("/admin/crud/document-type");
            }
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: t("toast.error"),
                detail: error.response?.data || t("toast.genericError"),
                life: 3000,
            });
        }
    };

    // Dropdown Options
    const dropdownOptions = {
        course_offers: [],
        faculties: [
            { name: "Manaswee Kumar Samal", value: "Manaswee Kumar Samal" },
            { name: "Charanpreet Singh", value: "Charanpreet Singh" },
            { name: "Ridhi Agarwala", value: "Ridhi Agarwala" },
        ],
        faculty_types: [
            { label: t("courseOfferFacultyMapping.primary"), value: "primary" },
            { label: t("courseOfferFacultyMapping.secondary"), value: "secondary" },
        ],
    };

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
            <AddDataCard onSave={handleSubmit(onSubmitForm)} header={t("courseOfferFacultyMapping.header")}>
                <div className="row">
                    {renderDropdownField("course_offer_id", "course_offer", courseOffers)}
                    {renderMultiSelectField("faculty_id", "faculty", dropdownOptions.faculties)}
                    {renderDropdownField("faculty_type", "faculty_type", dropdownOptions.faculty_types)}
                </div>
            </AddDataCard>
        </AdminLayout>
    );
};

export default AddCourseOfferFacultyMapping;
