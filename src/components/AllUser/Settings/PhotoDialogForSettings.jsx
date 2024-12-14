import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {Dialog} from "primereact/dialog";
import {Toast} from 'primereact/toast';
import {useState} from "react";
import PropTypes from "prop-types";
import {Button} from "primereact/button";

const PhotoDialogForSettings = ({photo, type, header, visible, handleVisibleChange, toast}) => {
    const [photoPreview, setPhotoPreview] = useState(photo);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (type.includes(fileExtension)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        setPhotoPreview(reader.result);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                toast.current.show({severity:'warn', summary: 'Warning', detail:`Only ${type} files are allowed.`, life: 3000});
            }
        }
    };

    const headerElement = (
        <div>
            <h5 className="modal-title">{header}</h5>
        </div>
    );

    const footerElement = (
        <div>
            <Toast ref={toast} />
            <Button className="btn btn-primary" label="SAVE" onClick={() => handleVisibleChange()} autoFocus />
        </div>
    );

  return (
      <div>
          <Dialog visible={visible}
                  modal
                  header={headerElement}
                  footer={footerElement}
                  draggable={false}
                  onHide={() => {if (!visible) return; handleVisibleChange(); }}>
              <div className="modal-body py-0">
                  <div className="profile-img text-center">
                      <img
                          className="mb-3 h-auto"
                          alt="User Image"
                          src={photoPreview}
                          style={{maxWidth: "200px"}}
                      />
                      <div className="photo-upload replace-btn mt-3">
                          <label className="btn btn-primary">
                              <i><FontAwesomeIcon icon={faUpload} /></i>
                              &nbsp;Replace
                              <input
                                  type="file"
                                  className="uploadFile img"
                                  accept={type}
                                  onChange={handleFileChange}
                                  style={{ display: 'none' }}
                              />
                          </label>
                      </div>
                  </div>
              </div>
          </Dialog>
      </div>
  );
};

PhotoDialogForSettings.propTypes = {
    photo: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    visible: PropTypes.object.isRequired,
    handleVisibleChange: PropTypes.func.isRequired,
    toast: PropTypes.any.isRequired
}

export default PhotoDialogForSettings