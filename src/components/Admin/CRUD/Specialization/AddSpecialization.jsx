import AdminLayout from "../../AdminLayout.jsx";
import AddDataCard from "../AddDataCard.jsx";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCall from "../../../../Axios/APIHelper.jsx";
import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";

const AddSpecilization = () => {
  const { t } = useTranslation();
  const [programOptions, setProgramOptions] = useState([]);
  const [streamOptions, setStreamOptions] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);

  const toast = useRef(null);
  const navigate = useNavigate();

  const breadcrumbData = [
    { name: t("specialization.breadcrumb.dashboard"), url: "/admin/dashboard" },
    { name: t("specialization.breadcrumb.crud"), url: "/admin/crud" },
    { name: t("specialization.breadcrumb.specialization"), url: "/admin/crud/specialization" },
    { name: t("specialization.breadcrumb.add_specialization") },
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

    apiCall({
      url: "/dropdown/streams",
      method: "GET",
      showLoadingIndicator: true,
    })
      .then((response) => {
        const streamData = response.map((stream) => ({
          label: stream.name,
          value: stream.value,
        }));
        setStreamOptions(streamData);
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
      url: "/crud/specialization/add",
      data: { ...data, programOffer: selectedProgram, stream: selectedStream },
      method: "post",
      showLoadingIndicator: false,
    })
      .then((res) => {
        console.log(res);

        toast.current.show({
          severity: "success",
          summary: t("specialization.toast.success"),
          detail: t("specialization.toast.successDetail"),
          life: 3000,
        });
        reset();
        navigate("/admin/crud/specialization");
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response?.data || "An error occurred",
          life: 3000,
        });
      });
  };

  return (
    <AdminLayout breadcrumbItems={breadcrumbData} toast={toast}>
      <AddDataCard onSave={handleSubmit(onSubmitForm)} header={t("specialization.header")}>
        <div className="row">
          <div className="col-md-6">
            <label>{t("specialization.name")}*</label>
            <InputText
              name="name"
              className={`form-control ${errors.name && "p-invalid"}`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <span className="text-danger">{errors.name.message}</span>}
          </div>
          <div className="col-md-6">
            <label>{t("specialization.specializationCode")}*</label>
            <InputText
              name="specializationCode"
              className={`form-control ${errors.specializationCode && "p-invalid"}`}
              {...register("specializationCode", { required: "Specialization Code is required" })}
            />
            {errors.specializationCode && <span className="text-danger">{errors.specializationCode.message}</span>}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label>{t("specialization.programName")}*</label>
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
                  filter
                  filterBy="label"
                  className={`w-100 ${errors.programOffer && "p-invalid"}`}
                />
              )}
            />
            {errors.programOffer && <span className="text-danger">{errors.programOffer.message}</span>}
          </div>
          <div className="col-md-6">
            <label>{t("specialization.streamName")}*</label>
            <Controller
              name="stream"
              control={control}
              render={() => (
                <Dropdown
                  value={selectedStream}
                  options={streamOptions}
                  onChange={(e) => setSelectedStream(e.value)}
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

export default AddSpecilization;
