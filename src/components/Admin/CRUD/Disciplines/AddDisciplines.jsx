import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCall from "../../../../Axios/APIHelper.jsx";
import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";

const AddDiscipline = () => {
  const { t } = useTranslation();
  const toast = useRef(null);
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programOptions, setProgramOptions] = useState([]);

  const breadcrumbData = [
    { name: t("discipline.breadcrumb.dashboard"), url: "/admin/dashboard" },
    { name: t("discipline.breadcrumb.crud"), url: "/admin/crud" },
    { name: t("discipline.breadcrumb.discipline"), url: "/admin/crud/discipline" },
    { name: t("discipline.breadcrumb.add_discipline") },
  ];

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();

  useEffect(() => {
    apiCall({
      url: "/dropdown/program-offers",
      method: "GET",
      showLoadingIndicator: true,
    })
      .then((response) => {
        const programData = response.map((program) => ({
          label: program.name,
          value: program.value,
        }));
        setProgramOptions(programData);
      })
      .catch((error) => {
        console.error("Error fetching programs:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch programs",
          life: 3000,
        });
      });
  }, []);

  const onSubmitForm = (data) => {
    apiCall({
      url: "/crud/discipline/add",
      method: "post",
      data: { ...data, programOffer: selectedProgram },
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
        navigate("/admin/crud/discipline");
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

  return (
    <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
      <AddDataCard onSave={handleSubmit(onSubmitForm)} header={t("discipline.header")}>
        <div className="row">
          <div className="col-md-6">
            <label>{t("discipline.name")}*</label>
            <InputText
              name="name"
              className={`${errors.name && "p-invalid"} form-control`}
              {...register("name", { required: true })}
            />
          </div>
          <div className="col-md-6">
            <label>{t("discipline.disciplineCode")}*</label>
            <InputText
              name="disciplineCode"
              className={`${errors.disciplineCode && "p-invalid"} form-control`}
              {...register("disciplineCode", { required: true })}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label>{t("discipline.noOfSemesterInterval")}*</label>
            <InputText
              name="noOfSemesterInterval"
              className={`${errors.noOfSemesterInterval && "p-invalid"} form-control`}
              {...register("noOfSemesterInterval", { required: true })}
            />
          </div>
          <div className="col-md-6">
            <label>{t("discipline.number")}*</label>
            <InputText
              name="number"
              className={`${errors.number && "p-invalid"} form-control`}
              {...register("number", { required: true })}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label>{t("discipline.shortCode")}*</label>
            <InputText
              name="shortCode"
              className={`${errors.shortCode && "p-invalid"} form-control`}
              {...register("shortCode", { required: true })}
            />
          </div>
          <div className="col-md-6">
            <label>{t("academicSession.programOffer")}*</label>
            <Controller
              name="programOffer"
              control={control}
              render={() => (
                <Dropdown
                  value={selectedProgram}
                  options={programOptions}
                  onChange={(e) => setSelectedProgram(e.value)}
                  placeholder="Select"
                  optionLabel="label"
                  className={`w-100 ${errors.programOffer && "p-invalid"}`}
                />
              )}
            />
            {errors.programOffer && <span className="text-danger">{errors.programOffer.message}</span>}
          </div>
        </div>
      </AddDataCard>
    </AdminLayout>
  );
};

export default AddDiscipline;
