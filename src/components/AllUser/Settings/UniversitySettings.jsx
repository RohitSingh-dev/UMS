const UniversitySettings = () => {
  return (
      <div>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">University Setting</h5>
          </div>
          <div className="card-body ">
            <div className="row mt-3">
              <div className="col-lg-8 col-md-6 col-sm-12">
                <div className="form-group">
                  <label>University name</label>
                  <input type="text" className="form-control" placeholder="Type full name"></input>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="form-group">
                  <label>Short name</label>
                  <input type="text" className="form-control" placeholder="Type short name"></input>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Phone</label>
                  <input type="number" className="form-control" placeholder="Phone/landline"></input>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" placeholder="Email"></input>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label>Website</label>
                  <input type="text" className="form-control" placeholder="Website"></input>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">Details</label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
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

export default UniversitySettings