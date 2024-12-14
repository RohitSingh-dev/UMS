import {useState} from "react";

const EvaluationSettings = () => {
    const [selectedTeacherView, setSelectedTeacherView] = useState({
        beforeEvaluation: false,
        afterEvaluation: false,
    });

    const handleSelectionChange = (role) => {
        setSelectedTeacherView(prev => ({ ...prev, [role]: !prev[role] }));
    };

    const handleSubmit = () => {
        console.log('Form submitted', { selectedTeacherView });
    };

  return (
      <div className="settings-container">
          <div className="card">
              <div className="card-header">
                  <h5 className="card-title mb-4">Evaluation</h5>
              </div>
              <div className="card-body">
                  <div className="row mt-3">
                      <ol className="settings-container-ol">
                          <li>
                              <div className="col-md-6 col-sm-12 mx-1">
                                  <div className="form-group">
                                      <label>Mask page(s)</label>
                                      <div className="d-flex align-items-center">
                                          <input type="number" className="form-control"
                                                 placeholder="e.g. 1-5, 7, 10-12"></input>
                                      </div>
                                  </div>
                              </div>
                          </li>
                          <li>
                              <div className="col-md-12 mx-1">
                                  <div className="form-group mt-2">
                                      <label>Teacher can view the paper</label>
                                          <ul className="d-flex">
                                              {Object.entries(selectedTeacherView).map(([view, checked]) => (
                                                  <li key={view}>
                                                      <div className="form-check mt-1 mx-2">
                                                          <input
                                                              type="checkbox"
                                                              id={view}
                                                              className="form-check-input"
                                                              checked={checked}
                                                              onChange={() => handleSelectionChange(view)}
                                                          />
                                                          <label htmlFor={view} className="font-weight-normal">{view==='beforeEvaluation'? 'Before evaluation' : 'After evaluation'}</label>
                                                      </div>
                                                  </li>
                                              ))}
                                          </ul>
                                  </div>
                              </div>
                          </li>
                      </ol>
                  </div>
              </div>
          </div>
          <div className="col">
              <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Save</button>
          </div>
      </div>
  );
};

export default EvaluationSettings