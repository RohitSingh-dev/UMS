import { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import AddDataCard from "../../Admin/CRUD/AddDataCard";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const Grievance = ({ visible, onClose }) => {
    const { t } = useTranslation();
    const fileUploadRef = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const onFileUpload = (e) => {
        setUploadedFiles([...uploadedFiles, ...e.files]);
    };

    const onFileRemove = (file) => {
        setUploadedFiles(uploadedFiles.filter((f) => f.name !== file.name));
    };

    const customUploadHandler = () => {
        console.log("Custom upload triggered:", uploadedFiles);
    };

    return (
        <Dialog
            header={t("grievance.header")}
            visible={visible}
            position="top-right"
            style={{ width: "50vw" }}
            onHide={onClose}
            draggable={false}
            resizable={false}
        >
            <AddDataCard>
                <label>{t("grievance.fields.subject")}*</label>
                <InputText name="subject" />
                <label>{t("grievance.fields.details")}*</label>
                <InputTextarea rows={5} cols={30} />
                <div>
                    <label>{t("grievance.fields.uploadFiles")}</label>
                    <FileUpload
                        ref={fileUploadRef}
                        name="files"
                        customUpload
                        multiple
                        uploadHandler={customUploadHandler}
                        onSelect={onFileUpload}
                        onRemove={(e) => onFileRemove(e.file)}
                        emptyTemplate={
                            <p>{t("grievance.fields.emptyTemplate")}</p>
                        }
                    />
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            </AddDataCard>
        </Dialog>
    );
};

Grievance.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Grievance;
