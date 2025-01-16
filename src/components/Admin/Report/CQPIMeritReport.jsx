import {useState} from "react";
import AdminLayout from "../AdminLayout.jsx";
import {Dropdown} from "primereact/dropdown";
import {NavLink} from "react-router-dom";

const CQPIMeritReport = () => {
    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "Master Report", url: '/admin/master-report'},
        {name: "CQPI and Merit"}
    ];

    const [selectedReport, setSelectedReport] = useState(null);
    const reports = [
        { name: 'CQPI Merit-wise Report' },
        { name: 'CQPI Student ID-wise Report' }
    ];
    return (
        <AdminLayout breadcrumbItems={breadcrumbData}>
            <div className="card">
                <div className="row">
                    <div className="col-md-4">
                        <label>Report Name *</label><br />
                        <Dropdown value={selectedReport} onChange={(e) => setSelectedReport(e.value)} options={reports} optionLabel="name"
                                  placeholder="Select" className="w-100" />
                    </div>
                </div>
                <div className="mt-4">
                    <NavLink to="javascript:void(0)" className="btn btn-primary-violet">
                        SEARCH
                    </NavLink>
                </div>
            </div>
        </AdminLayout>
    )
}

export default CQPIMeritReport