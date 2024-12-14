import {useState} from "react";
import PropTypes from "prop-types";
import {Toast} from 'primereact/toast';

const LoginSettings = ({toast}) => {
    const [selectedRoles, setSelectedRoles] = useState({
        student: false,
        teacher: false,
        university: false,
        admin: false,
        bos: false,
    });

    const handleRoleChange = (role) => {
        setSelectedRoles(prev => ({ ...prev, [role]: !prev[role] }));
    };

    const handleSubmit = () => {
        console.log('Form submitted', { selectedRoles });
    };

  return (
      <div className="settings-container">
          <div className="card">
              <div className="card-header">
                  <h5 className="card-title mb-4">Login</h5>
              </div>
              <div className="card-body">
                  <div className="row">
                      <ol className="settings-container-ol">
                          <li>
                              <div className="col-sm-12">
                                  <span className="font-weight-600 color-black font-14">OTP is required for login</span>
                                  <ul className="d-flex">
                                      {Object.entries(selectedRoles).map(([role, checked]) => (
                                          <li key={role}>
                                              <div className="form-check mt-3 mx-2">
                                                  <input
                                                      type="checkbox"
                                                      id={role}
                                                      className="form-check-input"
                                                      checked={checked}
                                                      onChange={() => handleRoleChange(role)}
                                                  />
                                                  <label htmlFor={role} className="text-capitalize font-weight-normal font-14">{role}</label>
                                              </div>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </li>
                      </ol>
                  </div>
              </div>
          </div>
          <div className="col">
              <Toast ref={toast}/>
              <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Save</button>
          </div>
      </div>
  );
};

LoginSettings.propTypes = {
    toast: PropTypes.any.isRequired
}

export default LoginSettings