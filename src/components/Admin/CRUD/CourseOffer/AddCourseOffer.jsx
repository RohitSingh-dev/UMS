import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import apiCall from "../../../../Axios/APIHelper.jsx";

const AddCourseOffer = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State for dropdowns
  const [courseOptions, setCourseOptions] = useState([]);
  const [academicSessionOptions, setAcademicSessionOptions] = useState([]);
  const [concentrationOptions, setConcentrationOptions] = useState([]);
  const [courseTypeOptions, setCourseTypeOptions] = useState([]);
  const [disciplineOptions, setDisciplineOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAcademicSession, setSelectedAcademicSession] = useState(null);
  const [selectedConcentration, setSelectedConcentration] = useState(null);
  const [selectedCourseType, setSelectedCourseType] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

  const breadcrumbData = [
    { name: t("courseOffer.breadcrumb.dashboard"), url: "/admin/dashboard" },
    { name: t("courseOffer.breadcrumb.crud"), url: "/admin/crud" },
    { name: t("courseOffer.breadcrumb.course_offer"), url: "/admin/crud/course-offer" },
    { name: t("courseOffer.breadcrumb.add_course_offer") },
  ];

  const handleSpecializationChange = (specializationId) => {
    const params = { specialization: specializationId };
    apiCall({
      url: '/dropdown/concentrations',
      params: params,
      showLoadingIndicator: false
    }).then((res) => {
      setConcentrationOptions(res.map((concentration) => ({
        label: concentration.name, value: concentration.value
      })));
    })
    .catch((error) => {
      toast.current.show({severity: 'error', summary: 'Error', detail: error.response?.data, life: 3000});
    });
  };

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm();

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const courses = await apiCall({ url: "/dropdown/courses", method: "GET" });
        setCourseOptions(courses.map((course) => ({ label: course.name, value: course.value })));

        const academicSessions = await apiCall({ url: "/dropdown/academic-sessions", method: "GET" });
        setAcademicSessionOptions(academicSessions.map((session) => ({ label: session.name, value: session.value })));

        const concentrations = await apiCall({ url: "/dropdown/concentrations", method: "GET" });
        setConcentrationOptions(concentrations.map((concentration) => ({ label: concentration.name, value: concentration.value })));

        const courseTypes = await apiCall({ url: "/dropdown/course-types", method: "GET" });
        setCourseTypeOptions(courseTypes.map((type) => ({ label: type.name, value: type.value })));

        const disciplines = await apiCall({ url: "/dropdown/disciplines", method: "GET" });
        setDisciplineOptions(disciplines.map((discipline) => ({ label: discipline.name, value: discipline.value })));

        const specializations = await apiCall({ url: "/dropdown/specializations", method: "GET" });
        setSpecializationOptions(specializations.map((specialization) => ({ label: specialization.name, value: specialization.value })));
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch dropdown options",
          life: 3000,
        });
      }
    };

    fetchDropdownOptions();
  }, []);

  const onSubmitForm = (data) => {
    apiCall({
      url: "/crud/course-offer/add",
      method: "post",
      data: {
        ...data,
        course: selectedCourse,
        academicSession: selectedAcademicSession,
        courseType: selectedCourseType,
        concentration: selectedConcentration,
        discipline: selectedDiscipline,
        specialization: selectedSpecialization
      },
      showLoadingIndicator: false,
    })
      .then((res) => {
        console.log(res);
        toast.current.show({
          severity: "success",
          summary: t("discipline.toast.success"),
          detail: t("discipline.toast.successDetail"),
          life: 3000,
        });
        reset();
        navigate("/admin/crud/course-offer");
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: t("discipline.toast.error"),
          detail: error.response?.data || t("discipline.toast.genericError"),
          life: 3000,
        });
      });
  };

  const renderDropdownField = (name, label, options, selected, setSelected) => (
    <div className="mb-3 col-md-6">
      <label>
        {t(`courseOffer.${label}`)}
        {["specialization", "concentration"].includes(name) ? "" : "*"}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Dropdown
            id={field.name}
            value={selected}
            onChange={(e) => {
              if (name === "specialization") {
                field.onChange(e.value);
                handleSpecializationChange(e.value);
                setSelected(e.value);
              } else if (name === "concentration") {
                field.onChange(e.value);
                setSelected(e.value);
              } else {
                setSelected(e.value);
              }
            }}
            placeholder="-- Select --"
            options={options}
            optionLabel="label"
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

  const renderInputField = (name, label, validation) => (
    <div className={`mb-3 col-md-${name === "comments" ? 12 : 6}`}>
      <label>{t(`courseOffer.${label}`)}{`${name === "comments" ? '' : '*'}`}</label>
      <InputText
        name={name}
        className={`${errors[name] && "p-invalid"} form-control`}
        {...register(name, {
          ...validation,
          maxLength: validation.maxLength
            ? {
              value: validation.maxLength.value,
              message: t("validationMessages.maxLength", { max: validation.maxLength.value }),
            }
            : undefined,
          validate: validation.validate,
        })}
      />
      {errors[name] && <span className="text-danger">{errors[name].message}</span>}
    </div>
  );

  return (
    <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
      <AddDataCard onSave={handleSubmit(onSubmitForm)} header={t("courseOffer.header")}>
        <div className="row">
          {renderDropdownField("course", "course", courseOptions, selectedCourse, setSelectedCourse)}
          {renderDropdownField("academicSession", "academicSession", academicSessionOptions, selectedAcademicSession, setSelectedAcademicSession)}
          {renderInputField("courseCode", "courseCode", { maxLength: { value: 255 } })}
          {renderInputField("courseOfferCode", "courseOfferCode", { maxLength: { value: 255 } })}
          {renderDropdownField("courseType", "courseType", courseTypeOptions, selectedCourseType, setSelectedCourseType)}
          {renderInputField("courseObjective", "courseObjective", { maxLength: { value: 255 } })}
          {renderDropdownField("specialization", "specialization", specializationOptions, selectedSpecialization, setSelectedSpecialization)}
          {renderDropdownField("discipline", "programOffer", disciplineOptions, selectedDiscipline, setSelectedDiscipline)}
          {renderDropdownField("concentration", "concentration", concentrationOptions, selectedConcentration, setSelectedConcentration)}
          {renderInputField("credit", "credit", {
            validate: (value) =>
              value > 0 || t("validationMessages.positiveNumber", { field: t("courseOffer.credit") }),
          })}
          {renderInputField("comments", "comments", { maxLength: { value: 255 } })}
        </div>
      </AddDataCard>
    </AdminLayout>
  );
};

export default AddCourseOffer;
