import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import PhotoDialogForSettings from "./PhotoDialogForSettings.jsx";
import PropTypes from "prop-types";
import CookieHelper from "../../../services/UseCookies.jsx";
import {Calendar} from 'primereact/calendar';
import {ROLE_COOKIES_NAME, USERNAME_COOKIES_NAME} from "../../../Util/AppConstant.jsx";

const ProfileSettings = ({toast}) => {
    const [visible, setVisible] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [date, setDate] = useState(null);
    const photo = '/src/assets/UserDocument/Images/avatar.jpg';
    
    const handleVisibleChange = () => {
      setVisible(false);
    }

    const parsedRole = JSON.parse(CookieHelper.getCookie(ROLE_COOKIES_NAME));

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="profile-header">
                        <div className="row align-items-center">
                            <div className="col-auto profile-image position-relative">
                                <a className="photo-edit d-block position-absolute" onClick={() => setVisible(true)}>
                                    <i><FontAwesomeIcon icon={faCamera} /></i>
                                </a>
                                <PhotoDialogForSettings photo={photo} type={".jpg, .jpeg, .png"} header={"Edit your photo"}
                                                        visible={visible} handleVisibleChange={handleVisibleChange}
                                                        toast={toast} />
                                <img className="rounded-circle" alt="User Image"
                                     src={photo}></img>
                            </div>
                            <div className="col ml-md-n2 profile-user-info">
                                <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                        <h4 className="user-name mb-0">{CookieHelper.getCookie(USERNAME_COOKIES_NAME)}</h4>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="about-text">
                                            <p className="m-0">Ph.D. Mathematics</p>
                                            <p className="m-0"><span className="mr-2">EMP ID: AB13176</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Personal Information</h5>
                        </div>
                        <div className="card-body ">
                            <div className="row mt-3">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>{parsedRole === "ROLE_STUDENT" ? "Date of registration" : "Date of joining"}</label>
                                        <Calendar className="custom-calendar"
                                                  value={date}
                                                  onChange={(e) => setDate(e.value)}
                                                  dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" showButtonBar />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="dob">Date of birth</label>
                                        <Calendar className="custom-calendar" id="dob"
                                                  value={dateOfBirth}
                                                  onChange={(e) => setDateOfBirth(e.value)}
                                                  dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select className="form-select form-control"
                                                aria-label="Default select example">
                                            <option selected="">Select one --</option>
                                            <option value="1">M</option>
                                            <option value="2">F</option>

                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">

                                    <div className="form-group">
                                        <label>Religion</label>
                                        <select className="form-select form-control"
                                                aria-label="Default select example">
                                            <option value="" selected="selected"
                                                    disabled="disabled">Select one --
                                            </option>
                                            <option
                                                value="African Traditional &amp; Diasporic">African
                                                Traditional &amp; Diasporic
                                            </option>
                                            <option value="Agnostic">Agnostic</option>
                                            <option value="Atheist">Atheist</option>
                                            <option value="Baha'i">Baha&apos;i</option>
                                            <option value="Buddhism">Buddhism</option>
                                            <option value="Cao Dai">Cao Dai</option>
                                            <option value="Chinese traditional religion">Chinese
                                                traditional religion
                                            </option>
                                            <option value="Christianity">Christianity</option>
                                            <option value="Hinduism">Hinduism</option>
                                            <option value="Islam">Islam</option>
                                            <option value="Jainism">Jainism</option>
                                            <option value="Juche">Juche</option>
                                            <option value="Judaism">Judaism</option>
                                            <option value="Neo-Paganism">Neo-Paganism</option>
                                            <option value="Nonreligious">Nonreligious</option>
                                            <option value="Rastafarianism">Rastafarianism</option>
                                            <option value="Secular">Secular</option>
                                            <option value="Shinto">Shinto</option>
                                            <option value="Sikhism">Sikhism</option>
                                            <option value="Spiritism">Spiritism</option>
                                            <option value="Tenrikyo">Tenrikyo</option>
                                            <option
                                                value="Unitarian-Universalism">Unitarian-Universalism
                                            </option>
                                            <option value="Zoroastrianism">Zoroastrianism</option>
                                            <option value="primal-indigenous">primal-indigenous
                                            </option>
                                            <option value="Other">Other</option>

                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">

                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" className="form-control"
                                               placeholder="Address"></input>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" className="form-control"
                                               placeholder="City"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>District</label>
                                        <input type="text" className="form-control"
                                               placeholder="District"></input>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>PIN</label>
                                        <input type="text" className="form-control"
                                               placeholder="Pin"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Contact Information</h5>
                        </div>
                        <div className="card-body ">
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input type="number" className="form-control"
                                               placeholder="Phone" pattern="[0-9]{10}"></input>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Whatsapp</label>
                                        <input type="text" className="form-control"
                                               placeholder="Whatsapp"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" className="form-control"
                                               placeholder="Email"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col">
                    <button className="btn btn-primary" type="submit">Save</button>
                </div>
            </div>
        </div>
    );
};

ProfileSettings.propTypes = {
    toast: PropTypes.any.isRequired
}

export default ProfileSettings