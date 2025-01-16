import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCall from "../../../../Axios/APIHelper.jsx";
import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";

const AddCourses = () => {
  const { t } = useTranslation();
  const toast = useRef(null);
  const navigate = useNavigate();
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedCourseType, setSelectedCourseType] = useState(null);
  const [courseTypeOptions, setCourseTypeOptions] = useState([]);

  const breadcrumbData = [
    { name: t("courses.breadcrumb.dashboard"), url: "/admin/dashboard" },
    { name: t("courses.breadcrumb.crud"), url: "/admin/crud" },
    { name: t("courses.breadcrumb.courses"), url: "/admin/crud/courses" },
    { name: t("courses.breadcrumb.add_courses") },
  ];

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm();

  useEffect(() => {
    apiCall({
      url: "/dropdown/course-types",
      method: "GET",
      showLoadingIndicator: true,
    })
      .then((response) => {
        const courseTypeData = response.map((courseType) => ({
          label: courseType.name,
          value: courseType.value,
        }));
        setCourseTypeOptions(courseTypeData);
      })
      .catch((error) => {
        console.error("Error fetching course offers:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch course offers",
          life: 3000,
        });
      });
  }, []);

  const onSubmitForm = (data) => {
    apiCall({
      url: "/crud/course/add",
      data: {...data, status: selectedColumn, courseType: selectedCourseType },
      method: "post",
      showLoadingIndicator: false,
    })
      .then((res) => {
        console.log(res);
        
        toast.current.show({
          severity: "success",
          summary: t("courses.toast.success"),
          detail: t("courses.toast.successDetail"),
          life: 3000,
        });
        reset();
        navigate("/admin/crud/courses");
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: t("courses.toast.error"),
          detail: error.response?.data || t("courses.toast.genericError"),
          life: 3000,
        });
      });
  };

  const columnOptions = [
    { label: 'Open', value: 'true' },
    { label: 'Close', value: 'false' }
  ];

  return (
    <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
      <AddDataCard onSave={handleSubmit(onSubmitForm)} header={t("courses.header")}>
        <div className="row">
          <div className="col-md-6">
            <label>{t("courses.course_objective")}*</label>
            <InputText
              name="courseObjective"
              className={`${errors.courseObjective && "p-invalid"} form-control`}
              {...register("courseObjective", { required: true })}
            />
          </div>
          <div className="col-md-6">
            <label>{t("courses.name")}*</label>
            <InputText
              name="name"
              className={`${errors.name && "p-invalid"} form-control`}
              {...register("name", { required: true })}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label>{t("courses.short_name")}*</label>
            <InputText
              name="shortName"
              className={`${errors.shortName && "p-invalid"} form-control`}
              {...register("shortName", { required: true })}
            />
          </div>
          <div className="col-md-6">
            <label>{t("courses.course_id_code")}*</label>
            <InputText
              name="courseIdCode"
              className={`${errors.courseIdCode && "p-invalid"} form-control`}
              {...register("courseIdCode", { required: true })}
            />
          </div>
        </div>
        <div className="row mt-3">
        <div className="col-md-6">
            <label>{t("courses.syllabus")}*</label>
            <InputText
              name="syllabus"
              className={`${errors.syllabus && "p-invalid"} form-control`}
              {...register("syllabus", { required: true })}
            />
          </div>
          <div className="col-md-6">
            <label>{t("courses.course_type_code")}*</label>
            <Controller
              name="courseType"
              control={control}
              render={() => (
                <Dropdown
                  value={selectedCourseType}
                  options={courseTypeOptions}
                  onChange={(e) => setSelectedCourseType(e.value)}
                  placeholder="Select"
                  optionLabel="label"
                  filter
                  filterBy="label"
                  className={`w-100 ${errors.courseType && "p-invalid"}`}
                />
              )}
            />
            {errors.courseType && <span className="text-danger">{errors.courseType.message}</span>}
          </div>
        </div>
        <div className="row mt-3">
        <div className="col-md-6">
            <label>{t("courses.is_active")}*</label>
            <Controller
                name="status"
                control={control}
                render={() => (
                    <Dropdown
                        value={selectedColumn}
                        options={columnOptions}
                        onChange={(e) => setSelectedColumn(e.value)}
                        placeholder="Select"
                        optionLabel="label"
                        className={`${errors.program && "p-invalid"} w-100`}
                    />
                )}
            />
          </div>
        </div>
      </AddDataCard>
    </AdminLayout>
  );
};

export default AddCourses;
