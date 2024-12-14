import StudentLayout from "./StudentLayout";
import { Card } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import CustomBreadCrumb from "../AllUser/CustomBreadCurmb";

function Examination() {
  const data = [
    {
      id: "1",
      code: "51911",
      name: "Evolution of Geographical Thought",
      examdate: "27-01-2022",
      examtime: "1:00 PM to 3:00 PM",
    },
  ];

  const item = [
    {
      name: "Examination",
      link: "#",
    },
  ];

  const actionBodyTemplate = (rowData) => {
    const confirmDeleteProduct = (product) => {
      console.log(product);
    };

    return (
      <Button
        label="download"
        link
        severity="info"
        onClick={() => confirmDeleteProduct(rowData)}
      />
    );
  };

  return (
    <StudentLayout>
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <CustomBreadCrumb items={item} dashboardLink="/student/dashboard" />
            <div className="d-flex justify-content-between d-xl-flex d-lg-flex d-md-flex d-sm-block ">
              <h3 className="page-title dashboard-page-title">
                Examination Details
              </h3>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <DataTable value={data} tableStyle={{ minWidth: "50rem" }}>
          <Column
            header="#"
            headerStyle={{ width: "3rem" }}
            body={(data, options) => options.rowIndex + 1}
          ></Column>
          <Column field="code" header="Code"></Column>
          <Column field="name" header="Name"></Column>
          <Column field="examdate" header="Category"></Column>
          <Column field="examtime" header="Quantity"></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </Card>
    </StudentLayout>
  );
}

export default Examination;
