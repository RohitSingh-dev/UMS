import {useState} from "react";

const PaymentSettings = () => {
  const [isTestMode, setIsTestMode] = useState(false);

  const handleCheckboxChange = () => {
    setIsTestMode(!isTestMode);
  };

  return (
      <div>
        <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-4">Payment</h5>
              </div>
              <div className="card-body ">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Choose payment gateway</label>
                      <select className="form-select form-control" aria-label="Default select example">
                        <option selected="">Select one --</option>
                        <option value="1">Razorpay</option>
                        <option value="2">PhonePe</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-12">
                    <div className="form-group form-check mt-2">
                      <input type="checkbox" className="form-check-input" id="test_mode" checked={isTestMode}
                             onChange={handleCheckboxChange}></input>
                      <label className="form-check-label" htmlFor="test_mode">Is the payment system currently in test
                        mode?</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={`form-group ${isTestMode? 'd-none': ''}`}>
                      <label>Live key</label>
                      <input type="text" className="form-control" placeholder="Live key" disabled={isTestMode}></input>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={`form-group ${isTestMode? 'd-none': ''}`}>
                      <label>Live salt</label>
                      <input type="text" className="form-control" placeholder="Live salt" disabled={isTestMode}></input>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={`form-group ${isTestMode? '': 'd-none'}`}>
                      <label>Test key</label>
                      <input type="text" className="form-control" placeholder="Test key" disabled={!isTestMode}></input>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={`form-group ${isTestMode? '': 'd-none'}`}>
                      <label>Test salt</label>
                      <input type="text" className="form-control" placeholder="Test salt" disabled={!isTestMode}></input>
                    </div>
                  </div>
                </div>
              </div>
        </div>
        <div className="col">
            <button className="btn btn-primary" type="submit">Save</button>
        </div>
      </div>
  );
};

export default PaymentSettings