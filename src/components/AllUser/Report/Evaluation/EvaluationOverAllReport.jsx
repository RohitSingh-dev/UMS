import TeacherLayout from "../../../Teacher/TeacherLayout.jsx";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {useEffect, useRef, useState} from "react";
import {Tag} from "primereact/tag";
import axios from "axios";
import CookieHelper from "../../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../Util/AppConstant.jsx";
import GradientProgressBar from "../../GradientProgressBar.jsx";
import {Button} from "primereact/button";

const EvaluationOverAllReport = () => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);

    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {
            answerScriptId: {value: '', matchMode: 'contains'},
        }
    });


    useEffect(() => {
        axios.get('/report/evaluation/overall', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log(response)
                    setData(response.data)
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: "Some error happen",
                        life: 3000
                    });
                }
            })
            .catch((error) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data,
                    life: 3000
                });
            });
    }, [])


    const breadcrumbData = [
        {name: "Dashboard", url: "/teacher/dashboard"},
        {name: "Report", url: "/report"},
        {name: "Evaluation"}
    ];

    const onPage = (event) => {
        setLazyState(prevState => ({...prevState, ...event}));
    };


    const onSort = (event) => {
        setLazyState(prevState => ({...prevState, ...event}));
    };


    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value); // Update the input value state
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                <div>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"/>
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search"/>
                    </IconField>
                </div>
                <div>
                    <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
                    <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
                </div>
            </div>
        );
    };

    // const onRowExpand = (event) => {
    //     toast.current.show({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
    // };
    //
    // const onRowCollapse = (event) => {
    //     toast.current.show({severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000});
    // };

    const expandAll = () => {
        let _expandedRows = {};

        data.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };


    const marksBodyTemplate = (rowData) => {
        return rowData.total_obtain_marks === undefined ? "_" : rowData.total_obtain_marks;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.is_evaluated} severity={getProductSeverity(rowData)}></Tag>;
    };

    const getProductSeverity = (product) => {
        switch (product.is_evaluated) {
            case 'Evaluated':
                return 'success';

            case 'Not Evaluated':
                return 'danger';

            default:
                return null;
        }
    };


    const allowExpansion = (rowData) => {
        return rowData.paper_details.length > 0;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Answer Script for {data.name}</h5>
                <DataTable value={data.paper_details}>
                    <Column header="Sl." body={(rowData, options) => options.rowIndex + 1}
                            headerStyle={{width: '1%'}}/>
                    <Column field="answer_script_id" header="Answer Script Id"></Column>
                    <Column field="total_marks" header="Total Marks"></Column>
                    <Column field="total_obtain_marks" header="Obtain Marks" body={marksBodyTemplate}></Column>
                    <Column field="duration" header="Duration" ></Column>
                    <Column field="is_evaluated" header="Status"  body={statusBodyTemplate}></Column>
                </DataTable>
            </div>
        );
    };


    const percentageBodyTemplate = (data) => {
        return <GradientProgressBar percentage={data.evaluate_percentage}/>
    }

    return (
        <TeacherLayout breadcrumbItems={breadcrumbData} toastRef={toast}>
            <div className="card">
                <DataTable value={data} expandedRows={expandedRows}  onRowToggle={(e) => setExpandedRows(e.data)}
                           rowExpansionTemplate={rowExpansionTemplate}
                           dataKey="id" header={renderHeader} tableStyle={{minWidth: '60rem'}}>
                    <Column expander={allowExpansion} style={{width: '5rem'}}/>
                    <Column header="Sl." body={(rowData, options) => options.rowIndex + 1}
                            headerStyle={{width: '1%'}}/>
                    <Column field="name" header="Name"/>
                    <Column field="total_assign" header="Total Answer Script"/>
                    <Column field="evaluated" header="Evaluated Answer Script"/>
                    <Column field="duration" header="Total Duration"/>
                    <Column field="evaluate_percentage" header="Complete Percentage" body={percentageBodyTemplate}/>
                </DataTable>
            </div>
        </TeacherLayout>
    );
}

export default EvaluationOverAllReport;