import TeacherLayout from "../../Teacher/TeacherLayout.jsx";
import BOSLayout from "../../BOS/BOSLayout.jsx";
import AdminLayout from "../../Admin/AdminLayout.jsx";
import {useRef, useState} from "react";
import ProfileSettings from "./ProfileSettings.jsx";
import EvaluationSettings from "./EvaluationSettings.jsx";
import LoginSettings from "./LoginSettings.jsx";
import QuestionBankSettings from "./QuestionBankSettings.jsx";
import UniversitySettings from "./UniversitySettings.jsx";
import PaymentSettings from "./PaymentSettings.jsx";
import BrandingSettings from "./BrandingSettings.jsx";
import PropTypes from "prop-types";

const Settings = ({role}) => {
    const toast = useRef(null);

    const [activeTab, setActiveTab] = useState('profile');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };
    
    const Layout = role === "ROLE_TEACHER" ? TeacherLayout : role === "ROLE_ADMIN" ? AdminLayout : BOSLayout;

  return (
      <Layout toastRef={toast}>
          <div className="row">
              <div className="d-flex justify-content-center mt-20">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-5">
                      <div className="tab-vertical">
                          <div>
                              <ul className="nav nav-tabs" id="myTab3" role="tablist">
                                  <li className="mb-4">
                                      <h3>Setting of</h3>
                                  </li>
                                  <li className="nav-item">
                                      <button
                                          className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                          onClick={() => handleTabClick('profile')}>
                                          Profile
                                      </button>
                                  </li>
                                  <li className="nav-item">
                                      <button
                                          className={`nav-link ${activeTab === 'evaluation' ? 'active' : ''}`}
                                          onClick={() => handleTabClick('evaluation')}>
                                          Evaluation
                                      </button>
                                  </li>
                                  <li className="nav-item">
                                      <button
                                          className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                                          onClick={() => handleTabClick('login')}>
                                          Login
                                      </button>
                                  </li>
                                  <li className="nav-item">
                                      <button
                                          className={`nav-link ${activeTab === 'question-bank' ? 'active' : ''}`}
                                          onClick={() => handleTabClick('question-bank')}>
                                          Question Bank
                                      </button>
                                  </li>
                                  <li className="nav-item">
                                      <button
                                          className={`nav-link ${activeTab === 'payment' ? 'active' : ''}`}
                                          onClick={() => handleTabClick('payment')}>
                                          Payment
                                      </button>
                                  </li>
                                  <li className="nav-item">
                                      <button
                                          className={`nav-link ${activeTab === 'university' ? 'active' : ''}`}
                                          onClick={() => handleTabClick('university')}>
                                          University
                                      </button>
                                  </li>
                                  <li className="nav-item">
                                      <button
                                          className={`nav-link ${activeTab === 'branding' ? 'active' : ''}`}
                                          onClick={() => handleTabClick('branding')}>
                                          Branding
                                      </button>
                                  </li>
                              </ul>
                          </div>
                          <div className="tab-content">
                              <div className={`tab-pane ${activeTab === 'profile' ? 'active' : ''}`} id="home-vertical">
                                  <ProfileSettings toast={toast}/>
                              </div>
                              <div className={`tab-pane ${activeTab === 'evaluation' ? 'active' : ''}`} id="profile-vertical">
                                  <EvaluationSettings />
                              </div>
                              <div className={`tab-pane ${activeTab === 'login' ? 'active' : ''}`} id="contact-vertical">
                                  <LoginSettings toast={toast}/>
                              </div>
                              <div className={`tab-pane ${activeTab === 'question-bank' ? 'active' : ''}`} id="contact-vertical">
                                  <QuestionBankSettings />
                              </div>
                              <div className={`tab-pane ${activeTab === 'payment' ? 'active' : ''}`} id="contact-vertical">
                                  <PaymentSettings />
                              </div>
                              <div className={`tab-pane ${activeTab === 'university' ? 'active' : ''}`} id="contact-vertical">
                                  <UniversitySettings />
                              </div>
                              <div className={`tab-pane ${activeTab === 'branding' ? 'active' : ''}`} id="contact-vertical">
                                  <BrandingSettings toast={toast} />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </Layout>
  )
}

Settings.propTypes ={
    role: PropTypes.any.isRequired
}

export default Settings