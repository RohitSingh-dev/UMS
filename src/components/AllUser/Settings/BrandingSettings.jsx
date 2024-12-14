import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog';
import {Toast} from 'primereact/toast';
import {useState} from "react";
import PhotoDialogForSettings from "./PhotoDialogForSettings.jsx";
import PropTypes from "prop-types";
import axios from "axios";
import CookieHelper from "../../../services/UseCookies.jsx";
import {APP_FOOTER, JWT_COOKIES_NAME} from "../../Util/AppConstant.jsx";

const BrandingSettings = ({toast}) => {
  const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
  const [primaryColor, setPrimaryColor] = useState(getComputedStyle(document.documentElement).getPropertyValue('--primary_color'));
  const [secondaryColor, setSecondaryColor] = useState(getComputedStyle(document.documentElement).getPropertyValue('--secondary_color'));
  const [mainBgColor, setMainBgColor] = useState(getComputedStyle(document.documentElement).getPropertyValue('--main_bg_color'));
  const [sidebarBgColor, setSidebarBgColor] = useState(getComputedStyle(document.documentElement).getPropertyValue('--sidebar_bg'));
  const [sidebarFontColor, setSidebarFontColor] = useState(getComputedStyle(document.documentElement).getPropertyValue('--sidebar_font'));
  const [fullLogoVisible, setFullLogoVisible] = useState(false);
  const [smallLogoVisible, setSmallLogoVisible] = useState(false);
  const [faviconVisible, setFaviconVisible] = useState(false);
  const productFullLogo = '/src/assets/productLogo/fullLogo.png';
  const productSmallLogo = '/src/assets/productLogo/smallLogo.png';
  const productFavicon = '/src/assets/productLogo/favicon.png';

  const handlePrimaryColorChange = (e) => {
    const selectedPrimaryColor = e.target.value;
    setPrimaryColor(selectedPrimaryColor);
    document.documentElement.style.setProperty('--primary_color', selectedPrimaryColor);
  }

  const handleSecondaryColorChange = (e) => {
    const selectedSecondaryColor = e.target.value;
    setSecondaryColor(selectedSecondaryColor);
    document.documentElement.style.setProperty('--secondary_color', selectedSecondaryColor);
  }

  const handleMainBgColorChange = (e) => {
    const selectedMainBgColor = e.target.value;
    setMainBgColor(selectedMainBgColor);
    document.documentElement.style.setProperty('--main_bg_color', selectedMainBgColor);
  };

  const handleSidebarBgColorChange = (e) => {
    const selectedSidebarBgColor = e.target.value;
    setSidebarBgColor(selectedSidebarBgColor);
    document.documentElement.style.setProperty('--sidebar_bg', selectedSidebarBgColor);
  }

  const handleSidebarFontColorChange = (e) => {
    const selectedSidebarFontColor = e.target.value;
    setSidebarFontColor(selectedSidebarFontColor);
    document.documentElement.style.setProperty('--sidebar_font', selectedSidebarFontColor);
  }

  const handleResetClick = () => {
    document.documentElement.style.setProperty('--primary_color', '#8456f8');
    document.documentElement.style.setProperty('--secondary_color', '#df66ce');
    document.documentElement.style.setProperty('--main_bg_color', '#f9fbfc');
    document.documentElement.style.setProperty('--sidebar_bg', '#e0e0eb');
    document.documentElement.style.setProperty('--sidebar_font', '#333333');
    setPrimaryColor('#8456f8');
    setSecondaryColor('#df66ce');
    setMainBgColor('#f9fbfc');
    setSidebarBgColor('#e0e0eb');
    setSidebarFontColor('#333333');
    onSubmit();
  }

  const handleVisibleChange = () => {
    setFullLogoVisible(false);
    setSmallLogoVisible(false);
    setFaviconVisible(false);
  }

  const confirmReset = () => {
    confirmDialog({
      message: 'Are you sure you want to change branding colors to default?',
      header: 'Warning',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      acceptClassName: "btn btn-primary",
      rejectClassName: "btn px-4",
      handleResetClick,
    });
  };

  const onSubmit = () => {
    const data = {
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      mainBgColor: mainBgColor,
      sidebarBgColor: sidebarBgColor,
      sidebarFontColor: sidebarFontColor,
    };
    const url = "branding/user";
    axios
        .put(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((res) => {
          console.log("Branding Colors Updated.", res);
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Branding Colors Updated',
            life: 3000
          });})
        .catch((ex) => {
          console.log(ex);
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating branding',
            life: 3000
          });
        });
  }

  return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="profile-header logo-header">
              <h5 className="user-name mb-4">Application Logo</h5>
              <div className="row align-items-center">
                <div className="col-auto profile-image position-relative d-flex flex-column">
                  <a className="photo-edit d-block position-absolute" onClick={() => setFullLogoVisible(true)}>
                    <i><FontAwesomeIcon icon={faCamera} /></i></a>
                  <PhotoDialogForSettings photo={productFullLogo} type={".png, .svg"} header={"Edit your logo"}
                                          visible={fullLogoVisible} handleVisibleChange={handleVisibleChange}
                                          toast={toast} />
                  <img className="mb-2" alt="Product Logo" src={productFullLogo}></img>
                    Big logo
                </div>
                <div className="col-auto profile-image position-relative d-flex flex-column">
                  <a className="photo-edit d-block position-absolute" onClick={() => setSmallLogoVisible(true)}>
                    <i><FontAwesomeIcon icon={faCamera} /></i></a>
                  <PhotoDialogForSettings photo={productSmallLogo} type={".png, .svg"} header={"Edit your logo"}
                                          visible={smallLogoVisible} handleVisibleChange={handleVisibleChange}
                                          toast={toast} />
                  <img className="mb-2" alt="Product Logo" src={productSmallLogo}></img>
                    Small logo
                </div>
                <div className="col-auto profile-image position-relative d-flex flex-column">
                  <a className="photo-edit d-block position-absolute" onClick={() => setFaviconVisible(true)}>
                    <i><FontAwesomeIcon icon={faCamera} /></i></a>
                  <PhotoDialogForSettings photo={productFavicon} type={".ico"} header={"Edit your photo"}
                                          visible={faviconVisible} handleVisibleChange={handleVisibleChange}
                                          toast={toast} />
                  <img className="mb-2" alt="Product Logo" src={productFavicon}></img>
                    Favicon
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body ">
                <ol className="settings-container-ol">
                  <li>
                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <h5 className="card-title mt-0">Brand color Setting</h5>
                          <Toast ref={toast} />
                          <ConfirmDialog />
                          <a className="bold-text cursor-pointer" href="#">Reset colors</a>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="form-group">
                          <label>Primary color</label>
                          <input type="color" className="form-control"
                                 placeholder="Primary Color"
                                 value={primaryColor} onChange={handlePrimaryColorChange}></input>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="form-group">
                          <label>Secondary color</label>
                          <input type="color" className="form-control"
                                 placeholder="Secondery Color"
                                 value={secondaryColor} onChange={handleSecondaryColorChange}></input>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="form-group">
                          <label>Main background color</label>
                          <input type="color" className="form-control"
                                 placeholder="Background Color"
                                 value={mainBgColor} onChange={handleMainBgColorChange}></input>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row mt-3">
                      <div className="col-12">
                        <h5 className="card-title mt-3">Sidebar color </h5>
                      </div>
                      <div className="col-auto">
                        <div className="form-group">
                          <label>Background</label>
                          <input type="color" className="form-control"
                                 placeholder="Sidebar Background"
                                 value={sidebarBgColor} onChange={handleSidebarBgColorChange}></input>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="form-group">
                          <label>Font color</label>
                          <input type="color" className="form-control"
                                 placeholder="Sidebar Font Color"
                                 value={sidebarFontColor} onChange={handleSidebarFontColorChange}></input>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row mt-3">
                      <div className="col-12">
                        <h5 className="card-title mt-3">Text changes </h5>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label>Footer text</label>
                          <input type="text" id="" className="form-control"
                                 placeholder={APP_FOOTER}></input>
                        </div>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-1">
          <div className="col">
            <button className="btn btn-primary" type="submit" onClick={onSubmit}>Save</button>
            <a className="bold-text cursor-pointer mx-4" href="#" onClick={confirmReset}>Set to default</a>
          </div>
        </div>
      </div>
  );
};

BrandingSettings.propTypes = {
  toast: PropTypes.any.isRequired
}

export default BrandingSettings