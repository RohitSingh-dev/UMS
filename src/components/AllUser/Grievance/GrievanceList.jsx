import { useState } from "react";
import AdminLayout from "../../Admin/AdminLayout.jsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import Grievance from "./Grievance.jsx";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const GrievanceList = () => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({
        ticketNumber: "",
        date: null,
        status: null,
    });
    const [entries, setEntries] = useState(10);
    const [isGrievanceDialogVisible, setIsGrievanceDialogVisible] = useState(false);

    const breadcrumbData = [
        { name: t("grievanceList.breadcrumb.dashboard"), url: '/admin/dashboard' },
        { name: t("grievanceList.breadcrumb.grievance"), url: '/admin/grievance' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "New":
                return "blue";
            case "Inprogress":
                return "yellow";
            case "Hold":
                return "orange";
            case "Escalated":
                return "pink";
            case "Resolved":
                return "green";
            case "Closed":
                return "gray";
            case "Rejected":
                return "red";
            default:
                return "black";
        }
    };
    
    const handleInputChange = (e, field) => {
        setFilters({ ...filters, [field]: e.target.value });
    };

    return (
        <AdminLayout
            breadcrumbItems={breadcrumbData}
            breadCrumbHeader={t("grievanceList.header")}
            dialogBtn={() => setIsGrievanceDialogVisible(true)}
            dialogBtnLabel="Add New"
        >
            <div className="row mt-5">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body min-h-auto">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <InputText
                                        placeholder={t("grievanceList.filters.ticketNumber")}
                                        value={filters.ticketNumber}
                                        onChange={(e) => handleInputChange(e, "ticketNumber")}
                                        className="w-100"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Calendar
                                        value={filters.date}
                                        onChange={(e) => handleInputChange(e, "date")}
                                        placeholder={t("grievanceList.filters.date")}
                                        dateFormat="dd-mm-yy"
                                        className="w-100"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Dropdown
                                        value={filters.status}
                                        options={t("grievanceList.statusOptions", { returnObjects: true })}
                                        onChange={(e) => handleInputChange(e, "status")}
                                        placeholder={t("grievanceList.filters.status")}
                                        className="w-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <div className="mb-2 d-flex align-items-center">
                        <span>{t("grievanceList.table.pagination.show")}</span>
                        <select
                            className="form-select form-select-sm mx-2"
                            value={entries}
                            onChange={(e) => setEntries(e.target.value)}
                            style={{ width: "auto" }}
                        >
                            {t("grievanceList.settings.pagination.entriesPerPage", { returnObjects: true }).map((entry) => (
                                <option key={entry} value={entry}>{entry}</option>
                            ))}
                        </select>
                        <span>{t("grievanceList.table.pagination.entries")}</span>
                    </div>

                    <DataTable
                        value={t("grievanceList.entries", { returnObjects: true }).slice(0, entries)}
                        paginator
                        rows={entries}
                        className="p-datatable-gridlines"
                        responsiveLayout="scroll"
                        paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    >
                        <Column field="id" header={t("grievanceList.table.columns.id")} />
                        <Column
                            field="subject"
                            header={t("grievanceList.table.columns.subject")}
                            body={(rowData) => (
                                <span className="text-truncate" style={{ maxWidth: "300px" }}>
                                    {rowData.subject}
                                </span>
                            )}
                        />
                        <Column
                            field="status"
                            header={t("grievanceList.table.columns.status")}
                            body={(rowData) => (
                                <div className="d-flex align-items-center">
                                    <span
                                        className="me-2"
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            backgroundColor: getStatusColor(rowData.status),
                                            borderRadius: "50%",
                                            display: "inline-block",
                                        }}
                                    ></span>
                                    <span>{rowData.status}</span>
                                </div>
                            )}
                        />
                        <Column field="date" header={t("grievanceList.table.columns.date")} />
                        <Column
                            body={() => (
                                <NavLink className="pr-1" to="/grievance/details"> <span>{t("grievanceList.table.viewDetails")}</span></NavLink>
                            )}
                            header={t("grievanceList.table.columns.actions")}
                        />
                    </DataTable>
                </div>
            </div>
            <Grievance visible={isGrievanceDialogVisible} onClose={() => setIsGrievanceDialogVisible(false)} />
        </AdminLayout>
    );
};

export default GrievanceList;
