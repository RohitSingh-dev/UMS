import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../Admin/AdminLayout.jsx";
import userImage from "../../../assets/UserDocument/Images/avatar.jpg";
import Grievance from "./Grievance.jsx";
import GrievanceDetailCard from "./GrievanceDetailCard.jsx";
import GrievanceFile from "./GrievanceFile.jsx";
import UserDetailCard from "./UserDetailCard.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faForward, faFilePdf, faFileWord } from "@fortawesome/free-solid-svg-icons";
import { faFileImage } from "@fortawesome/free-regular-svg-icons";

const GrievanceDetail = () => {
  const { t } = useTranslation();
  const [isGrievanceDialogVisible, setIsGrievanceDialogVisible] = useState(false);

  const breadcrumbData = [
    { name: t("grievanceDetail.breadcrumb.dashboard"), url: "/admin/dashboard" },
    { name: t("grievanceDetail.breadcrumb.grievance"), url: "/grievance" },
    { name: t("grievanceDetail.breadcrumb.details") },
  ];

  const title = "VR_1123456";

  const handleDialogToggle = useCallback(() => {
    setIsGrievanceDialogVisible((prevState) => !prevState);
  }, []);

  return (
    <AdminLayout
      breadcrumbItems={breadcrumbData}
      breadCrumbHeader={title}
      dialogBtn={handleDialogToggle}
      dialogBtnLabel={t("grievanceDetail.dialog.new")}
    >
      <div className="row mt-4">
        <div className="col-md-12">
          <UserDetailCard
            subject={t("grievanceDetail.userDetailCard.subject")}
            name="Manojit Chakravorty"
            regNo="RG34567567"
            award="BA(Bengali)"
            sem="3rd"
            email="bristi.mondal@gmail.com"
            mobile="8509011360"
          />
        </div>

        <div className="col-md-12">
          <GrievanceDetailCard
            name="Manojit Chakravorty"
            icon={userImage}
            date={t("grievanceDetail.grievanceDetailCard.date", { date: "Dec 19, 2024, 4:01 PM (21 hours ago)" })}
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been."
          />
        </div>

        <div className="col-md-12">
          <div className="status">
            <hr />
            <div className="color-red font-14">
              {t("grievanceDetail.status.hold")}
              <span> {t("grievanceDetail.status.date", { date: "Dec 19, 2024" })}</span>
            </div>
          </div>
        </div>

        <div className="col-12">
          <GrievanceDetailCard
            name="Manojit Chakravorty"
            icon={userImage}
            date={t("grievanceDetail.grievanceDetailCard.date", { date: "Dec 19, 2024, 4:01 PM (21 hours ago)" })}
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
          >
            <h5 className="mt-3">{t("grievanceDetail.grievanceDetailCard.uploadItems")}</h5>
            <ul className="upload-files mt-2">
              <GrievanceFile
                name="ABC.pdf"
                icon={faFilePdf}
                link="#"
                color="me-2 color-red"
                label={t("files.pdf")}
              />
              <GrievanceFile
                name="ABC.doc"
                icon={faFileWord}
                link="#"
                color="color-blue-lite me-2"
                label={t("files.word")}
              />
              <GrievanceFile
                name="ABC.jpg"
                icon={faFileImage}
                link="#"
                color="color-green me-2"
                label={t("files.image")}
              />
            </ul>

            <div className="d-flex mt-3">
              <button className="btn btn-secondary me-3" type="button" aria-label={t("grievanceDetail.grievanceDetailCard.buttons.reply")}>
                {t("grievanceDetail.grievanceDetailCard.buttons.reply")}
                <FontAwesomeIcon icon={faReply} className="ms-2" />
              </button>
              <button className="btn btn-secondary me-3" type="button" aria-label={t("grievanceDetail.grievanceDetailCard.buttons.assign")}>
                {t("grievanceDetail.grievanceDetailCard.buttons.assign")}
                <FontAwesomeIcon icon={faForward} className="ms-2" />
              </button>
            </div>
          </GrievanceDetailCard>
        </div>
      </div>

      <Grievance visible={isGrievanceDialogVisible} onClose={handleDialogToggle} />
    </AdminLayout>
  );
};

export default GrievanceDetail;
