import {useEffect, useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "react-bootstrap";
import openPopupWindow from "../../services/PopupWindwoServiec.jsx";
import TeacherLayout from "../Teacher/TeacherLayout.jsx";
import axios from "axios";
import CookieHelper from "../../services/UseCookies.jsx";
import ModeratorPaperPdfViewer from "../QuestionPaperCreation/ModeratorPaperPdf.jsx";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {resetQuestionDetails} from "../../Redux/questionDetailsSlice.jsx";
import {useDispatch} from "react-redux";
import apiCall from "../../Axios/APIHelper.jsx";
import CustomeLoader from "../../Util/CustomLoader.jsx";
import {JWT_COOKIES_NAME} from "../../Util/AppConstant.jsx";

const OnlineMarksSubmission = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const dispatch = useDispatch()
    const [answerScriptId, setAnswerScriptId] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const toast = useRef(null);
    const [pdfLink, setPdfLink] = useState(null); // Store the PDF link
    const [isQuestionPaperPdfVisible, setIsQuestionPaperPdfVisible] = useState(false);
    const [fetchedAnswerSheet, setFetchedAnswerSheet] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {
            "studentAnswer.answerScriptId": {value: '', matchMode: 'contains'},
        }
    });

    useEffect(() => {
        const delay = setTimeout(() => {
            // Update lazy state only after user has stopped typing
            setLazyState((prevState) => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    answerScriptId: {value: globalFilterValue, matchMode: 'contains'}, // Update filter for 'type' field
                },
                page: 0, // Reset to the first page on a new search
            }));
        }, 500); // 500ms delay

        return () => clearTimeout(delay); // Clear timeout if the component re-renders
    }, [globalFilterValue]); // Only trigger when globalFilterValue changes

    useEffect(() => {
        // Trigger the first load on mount
        loadLazyData(); // You can adjust the range (e.g., first 20 records)
    }, [lazyState]);

    const loadLazyData = () => {
        setLoading(true);
        const params = {
            page: lazyState.page,
            size: lazyState.rows,
            sortField: lazyState.sortField,
            sortOrder: lazyState.sortOrder,
            answerScriptId: lazyState.filters["studentAnswer.answerScriptId"].value || '',  // Ensure default value if undefined
        };

        apiCall({
            url: '/evaluation/get-all-student',
            method: 'get',
            params: params,
            retryOnTokenExpired: true,
            showLoadingIndicator: false
        }).then((data) => {
            setTotalRecords(data.totalRecords);
            setAnswerScriptId(data.data);
            setLoading(false)
        })
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
                setLoading(false);
            })
    };


    const actionBodyTemplate = (data) => {
        if (!data) return null; // If no data, return null to avoid errors
        if (data.obtainMark === null) {
            return (
                <Button type="button" rounded onClick={() => onEvaluateClick(data?.id)}>
                    Evaluate
                </Button>
            );
        } else {
            return (
                <Button type="button" rounded onClick={() => onClickView(data?.id)}>
                    View
                </Button>
            );
        }
    };

    const onClickView = (encryptedID) => {
        const url = fetchedAnswerSheet.find(sheet => sheet.id === encryptedID);
        if (url) {
            setPdfLink(url.url)
            setIsQuestionPaperPdfVisible(true)
            return
        }
        axios.get('/ans-script-manager/evaluate-answer-sheet', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                id: (encryptedID)
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setPdfLink(response.data)
                    setIsQuestionPaperPdfVisible(true)
                    setFetchedAnswerSheet((prevData) => [
                        ...prevData,
                        {id: encryptedID, url: response.data}
                    ]);
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
    }

    const obtainMark = (data) => {
        return <h4>{data?.obtainMark !== null && data?.obtainMark !== undefined && data?.obtainMark !== '' ? data.obtainMark : '-'}</h4>;
    };

    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const onEvaluateClick = (answerScriptId) => {
        if (isMobileDevice()) {
            toast.current.show({
                severity: "error",
                summary: "Not Supported",
                detail: "The evaluation page is not supported on mobile devices.",
                life: 5000
            });
        } else {
            window.updateStudentData = updateStudentData;
            const data = {answerScriptId: answerScriptId};
            openPopupWindow('/teacher/popupexamination', 'Evaluate', data, () => {
                dispatch(resetQuestionDetails()); // Cleanup Redux state on close
            });
        }
    };

    const updateStudentData = (data) => {
        setAnswerScriptId((prevStudents) =>
            prevStudents.map(student =>
                student?.id === data.answerSheetId
                    ? {...student, obtainMark: data.obtainMark}
                    : student
            )
        );
    };

    const breadcrumbData = [
        {name: "Dashboard", url: "/teacher/dashboard"},
        {name: "Online Evaluation"},
    ];
    const closeModal = () => {
        setIsQuestionPaperPdfVisible(false);
        setPdfLink(null);
    };

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
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange}
                                   placeholder="Search Answer Script Id"/>
                    </IconField>
                </div>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <TeacherLayout breadcrumbItems={breadcrumbData} toastRef={toast}>
            <div className="card">
                <DataTable
                    value={answerScriptId} showGridlines lazy dataKey="id" paginator
                    paginatorClassName="p-paginator-top" header={header}
                    first={lazyState.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                    sortField={lazyState.sortField} sortOrder={lazyState.sortOrder} onSort={onSort}
                    loading={loading} globalFilterFields={['answerScriptId']}
                    tableStyle={{minWidth: '100%'}} loadingIcon={<CustomeLoader/>}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                >
                    <Column header="No." body={(rowData, options) => options.rowIndex + 1}
                            headerStyle={{width: '1%'}}/>
                    <Column field="studentAnswer.answerScriptId" header="Answer Script Id" style={{width: '20%'}}
                            sortable showFilterMenu={false}/>
                    <Column field="obtainMark" header="Obtain Marks" style={{width: '20%'}} body={obtainMark}/>
                    <Column field="isEvaluated" header="Evaluate/View" style={{width: '10%'}}
                            body={actionBodyTemplate}/>
                </DataTable>
            </div>
            {pdfLink && (
                <ModeratorPaperPdfViewer
                    pdfLink={pdfLink}
                    header="Answer sheet"
                    isVisible={isQuestionPaperPdfVisible}
                    onClose={() => closeModal()}
                />
            )}
        </TeacherLayout>
    );
};

export default OnlineMarksSubmission;
