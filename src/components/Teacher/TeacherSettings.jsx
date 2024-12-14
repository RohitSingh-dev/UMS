import {faCamera, faUpload} from "@fortawesome/free-solid-svg-icons";
import TeacherLayout from "./TeacherLayout.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';

const TeacherSettings = () => {
    const breadcrumbData = [
        {name: "Dashboard", url: "/teacher/dashboard"},
        {name: "Setting"},
    ];

    const [visible, setVisible] = useState(false);
    const [photoPreview, setPhotoPreview] = useState('/src/assets/UserDocument/Images/avatar.jpg');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setPhotoPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const headerElement = (
        <div>
            <h5 className="modal-title">Edit your photo</h5>
        </div>
    );

    const footerContent = (
        <div>
            <Button className="btn btn-primary" label="SAVE" onClick={() => setVisible(false)} autoFocus />
        </div>
    );

  return (
      <TeacherLayout breadcrumbItems={breadcrumbData}>
          <div className="row">
              <div className="d-flex justify-content-center mt-20">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-5">
                      <div className="tab-vertical">
                          <div>
                              <ul className="nav nav-tabs" id="myTab3" role="tablist">
                                  <li className="nav-item">
                                      <a className="nav-link active" id="home-vertical-tab" data-toggle="tab"
                                         href="#home-vertical" role="tab" aria-controls="home"
                                         aria-selected="true">Profile</a>
                                  </li>
                                  <li className="nav-item">
                                      <a className="nav-link" id="profile-vertical-tab" data-toggle="tab"
                                         href="#profile-vertical" role="tab" aria-controls="profile"
                                         aria-selected="false">Evaluation</a>
                                  </li>
                                  <li className="nav-item">
                                      <a className="nav-link" id="contact-vertical-tab" data-toggle="tab"
                                         href="#contact-vertical" role="tab" aria-controls="contact"
                                         aria-selected="false">Login</a>
                                  </li>

                              </ul>
                          </div>
                          <div className="tab-content" id="myTabContent3">
                              <div className="tab-pane fade show active" id="home-vertical" role="tabpanel"
                                   aria-labelledby="home-vertical-tab">
                                  <div className="row">
                                      <div className="col-md-12">
                                          <div className="profile-header">
                                              <div className="row align-items-center">
                                                  <div className="col-auto profile-image position-relative">
                                                      <a className="photo-edit d-block position-absolute" onClick={() => setVisible(true)}>
                                                          <FontAwesomeIcon icon={faCamera} />
                                                      </a>
                                                      <Dialog visible={visible}
                                                              modal
                                                              header={headerElement}
                                                              footer={footerContent}
                                                              onHide={() => {if (!visible) return; setVisible(false); }}>
                                                              <div className="modal-body py-0">
                                                                  <div className="profile-img text-center">
                                                                      <img
                                                                          className="rounded-circle mb-3"
                                                                          alt="User Image"
                                                                          src={photoPreview}
                                                                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                                                      />
                                                                      <div className="photo-upload mt-3">
                                                                          <label className="replace-btn btn btn-primary">
                                                                              <FontAwesomeIcon icon={faUpload} />
                                                                              &nbsp;Replace
                                                                              <input
                                                                                  type="file"
                                                                                  className="uploadFile img"
                                                                                  accept="image/*"
                                                                                  onChange={handleFileChange}
                                                                                  style={{ display: 'none' }}
                                                                              />
                                                                          </label>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                      </Dialog>
                                                      <img className="rounded-circle" alt="User Image"
                                                           src="/src/assets/UserDocument/Images/avatar.jpg"></img>
                                                  </div>
                                                  <div className="col ml-md-n2 profile-user-info">
                                                      <div className="row">
                                                          <div className="col-md-12 col-sm-12">
                                                              <h4 className="user-name mb-0">Pomi Bagchi</h4>
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
                                                              <label>Date of Joining</label>
                                                              <input type="date" className="form-control"
                                                                     placeholder="Type text"></input>
                                                          </div>
                                                      </div>
                                                      <div className="col-6">
                                                          <div className="form-group">
                                                              <label>Date of Birth</label>
                                                              <input type="date" className="form-control"
                                                                     placeholder="Type text"></input>
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
                                                                     placeholder="Type your address"></input>
                                                          </div>
                                                      </div>
                                                      <div className="col-md-6">
                                                          <div className="form-group">
                                                              <label>City</label>
                                                              <input type="text" className="form-control"
                                                                     placeholder="Type text"></input>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="row">
                                                      <div className="col-md-6">
                                                          <div className="form-group">
                                                              <label>District</label>
                                                              <input type="text" className="form-control"
                                                                     placeholder="Type text"></input>
                                                          </div>
                                                      </div>
                                                      <div className="col-md-6">
                                                          <div className="form-group">
                                                              <label>PIN</label>
                                                              <input type="text" className="form-control"
                                                                     placeholder="Type your PIN"></input>
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
                                                              <label>My Phone</label>
                                                              <input type="text" className="form-control"
                                                                     placeholder="Type Number"></input>
                                                          </div>
                                                      </div>
                                                      <div className="col-md-6">
                                                          <div className="form-group">
                                                              <label>My Whatsapp</label>
                                                              <input type="text" className="form-control"
                                                                     placeholder="Type Number"></input>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="row">
                                                      <div className="col-md-6">
                                                          <div className="form-group">
                                                              <label>My Email</label>
                                                              <input type="email" className="form-control"
                                                                     placeholder="Type your email"></input>
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
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </TeacherLayout>
  )
}

export default TeacherSettings