import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import AdminLayout from "../../AdminLayout";
import { useTranslation } from "react-i18next";
import apiCall from "../../../../Axios/APIHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Enrollment = () => {
  const { t } = useTranslation();
  const [enrollments, setEnrollments] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const toast = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const breadcrumbData = [
    { name: t("courseOffer.breadcrumb.dashboard"), url: "/admin/dashboard" },
    { name: t("courseOffer.breadcrumb.crud"), url: "/admin/crud" },
    { name: t("enrollment.title"), url: "/admin/crud/enrollment" },
  ];

  useEffect(() => {
    apiCall({
      url: "/enrollment/enrollmentList",
      method: "GET",
      showLoadingIndicator: true,
    })
      .then((response) => {
        console.log(response)
        if(typeof response === "string"){
          response = JSON.parse(response)
        }
        setEnrollments(response.content);
      })
      .catch((error) => {
        console.error("Error fetching:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch",
          life: 3000,
        });
      });
  }, []);

  const expandAll = () => {
    const _expandedRows = {};
    enrollments.forEach((enrollment) => {
      _expandedRows[enrollment.id] = true;
    });
    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h5>Course List</h5>
        <DataTable value={data.courseOfferList}>
          <Column field="courseOfferName" header="Course Offer Name" sortable />
          <Column field="courseType" header="Course Type" sortable />
          <Column field="courseCode" header="Course Code" sortable />
          <Column field="specialization" header="Specialization" sortable />
          <Column field="concentration" header="Concentration" sortable />
        </DataTable>
      </div>
    );
  };

  const header = (
    <div className="d-flex justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <Button icon="pi pi-plus" label={"Expand All"} onClick={expandAll} text />
        <Button icon="pi pi-minus" label={"Collapse All"} onClick={collapseAll} text />
      </div>
      <div>
        <div className="dropdown-container">
          <button
            className="btn btn-primary-violet mb-4 dropdown-toggle"
            onClick={toggleDropdown}
          >
            <FontAwesomeIcon icon={faPlusCircle} /> Enroll&nbsp;Student
          </button>
          {dropdownOpen && (
            <div className={`dropdown-menu ${dropdownOpen ? 'd-block' : 'd-none'}`} style={{ top: "56px", right: "18px" }}>
              <NavLink to="add-by-course"
                onClick={() => setDropdownOpen(false)}
                className="dropdown-item">Add by Course</NavLink>
              <NavLink to="add-by-student"
                onClick={() => setDropdownOpen(false)}
                className="dropdown-item">Add by Student</NavLink>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  return (
    <AdminLayout breadcrumbItems={breadcrumbData}>
      <div className="card">
        <Toast ref={toast} />
        <DataTable
          value={enrollments}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}

          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
          header={header}
          tableStyle={{ minWidth: "60rem" }}
        >
          <Column expander style={{ width: "5rem" }} />
          <Column field="user.firstName" header="Name" sortable />
          <Column field="rollNo" header="Roll" sortable />
          <Column field="user.studentRegistrationDetails.batch.name" header="Batch" sortable />
          <Column field="user.studentRegistrationDetails.discipline.name" header="Program Name" sortable />
          <Column header="Academic Session Code" body="BM25-1" />
          <Column header="Term" body="TERM-1" />
        </DataTable>
      </div>
    </AdminLayout>
  );
};

export default Enrollment;