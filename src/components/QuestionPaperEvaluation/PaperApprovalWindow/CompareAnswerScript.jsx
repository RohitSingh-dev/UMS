import TeacherLayout from "../../Teacher/TeacherLayout.jsx";
import {useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "react-bootstrap";
import openPopupWindow from "../../../services/PopupWindwoServiec.jsx";
import {resetQuestionDetails} from "../../../Redux/questionDetailsSlice.jsx";
import {useDispatch} from "react-redux";

const CompareAnswerScript = () => {
    // const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const dispatch = useDispatch()
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(1);
    const [compareData, setCompareData] = useState([
        {
            answerScriptId: "AS202411071756446203",
            teachers: [
                {
                    id: 1,
                    name: "Rakesh Mondal",
                    givenMarks: 50
                },
                {
                    id: 2,
                    name: "Amit Ghosh",
                    givenMarks: 60
                }
            ]
        },
        {
            answerScriptId: "AS202411071756447234",
            teachers: [
                {
                    id: 1,
                    name: "Amit Ghosh",
                    givenMarks: 55
                },
                {
                    id: 2,
                    name: "Ankur Sarkar",
                    givenMarks: 70
                }
            ]
        }
    ]);
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
    const breadcrumbData = [
        {name: "Dashboard", url: "/teacher/dashboard"},
        {name: "Compare Answer Scripts"},
    ];

    // useEffect(() => {
    //     // Trigger the first load on mount
    //     loadLazyData(); // You can adjust the range (e.g., first 20 records)
    // }, [lazyState]);

    // const loadLazyData = () => {
    //     setLoading(true);
    //     const params = {
    //         page: lazyState.page,
    //         size: lazyState.rows,
    //         sortField: lazyState.sortField,
    //         sortOrder: lazyState.sortOrder,
    //         answerScriptId: lazyState.filters.answerScriptId.value || '',  // Ensure default value if undefined
    //     };
    //
    //     axios.get('/evaluation/get-all-answer-script', {
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${token}`,
    //         },
    //         params: params
    //     })
    //         .then(response => {
    //             setTotalRecords(response.data.totalRecords);
    //             console.log(response)
    //             setAnswerScriptId(response.data.data);
    //             setLoading(false);
    //         })
    //         .catch(error => {
    //             console.error("There was an error fetching the data!", error);
    //             setLoading(false);
    //         });
    // };

    const onPage = (event) => {
        setLazyState(prevState => ({...prevState, ...event}));
    };


    const onSort = (event) => {
        setLazyState(prevState => ({...prevState, ...event}));
    };

    const onCompareClick = (answerScriptId) => {
        const data = { answerScriptId: answerScriptId };
        openPopupWindow('/teacher/approvalpopup', 'Compare', data, () => {
            dispatch(resetQuestionDetails()); // Cleanup Redux state on close
        });
    };

    const actionBodyTemplate = (data) => {
        if (!data) return null; // If no data, return null to avoid errors
        return (
            <Button type="button" rounded onClick={() => onCompareClick(compareData[0].answerScriptId)}>
                Compare
            </Button>
        );
    };

    const teacherTemplate = (teacher, total) => {
      return (
          <div>
              <b><span>{teacher}</span></b><br />
              <span>Given Marks: {total}</span>
          </div>
      )
    }

  return (
      <TeacherLayout breadcrumbItems={breadcrumbData} toastRef={toast}>
          <div className="card">
              <DataTable
                  value={compareData} showGridlines lazy dataKey="id" paginator
                  paginatorClassName="p-paginator-top" totalRecords={totalRecords}
                  first={lazyState.first} rows={10} onPage={onPage}
                  sortField={lazyState.sortField} sortOrder={lazyState.sortOrder} onSort={onSort}
                  loading={loading} tableStyle={{minWidth: '100%'}}
                  paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              >
                  <Column header="No." body={(rowData, options) => lazyState.first + options.rowIndex + 1}
                          headerStyle={{width: '1%'}}/>
                  <Column field="answerScriptId" header="Answer Script Id" style={{width: '20%'}} sortable showFilterMenu={false}/>
                  <Column header="Evaluated Teacher 1" style={{width: '20%'}} body={(rowData) => teacherTemplate(rowData.teachers[0].name, rowData.teachers[0].givenMarks)}/>
                  <Column header="Evaluated Teacher 2" style={{width: '20%'}} body={(rowData) => teacherTemplate(rowData.teachers[1].name, rowData.teachers[1].givenMarks)}/>
                  <Column header="Action" style={{width: '10%'}}
                          body={actionBodyTemplate}/>
              </DataTable>
          </div>
      </TeacherLayout>
  )
}
export default CompareAnswerScript