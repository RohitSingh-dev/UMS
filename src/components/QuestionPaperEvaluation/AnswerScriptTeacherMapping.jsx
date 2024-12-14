import TeacherLayout from "../Teacher/TeacherLayout.jsx";
import {Dropdown} from 'primereact/dropdown';
import {FloatLabel} from 'primereact/floatlabel';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import CookieHelper from "../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../Util/AppConstant.jsx";

const AnswerScriptTeacherMapping = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const toast = useRef(null);
    const [teachers, setTeachers] = useState([])
    const [answerScriptId, setAnswerScriptId] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,  // Sorting field
        sortOrder: null,  // Sorting order: 1 for ascending, -1 for descending
        filters: {
            paperName: {value: '', matchMode: 'contains'}
        }
    });

    useEffect(() => {
        axios.get('/search_data/teachers', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                setTeachers(response.data)
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, [])

    useEffect(() => {
        if (selectedTeacher) {
            fetchStudents();
        }
    }, [selectedTeacher, lazyParams]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`search_data/teachers/answerScript`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: lazyParams.page,
                    size: lazyParams.rows,
                    paperName: lazyParams.filters.paperName.value || '',
                    sortField: lazyParams.sortField,
                    sortOrder: lazyParams.sortOrder,
                    teacherId:  (selectedTeacher.id)
                }
            });
            console.log(response)
            setAnswerScriptId(response.data.answerScript);
            setTotalRecords(response.data.totalRecords);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching answerScriptId:', error);
            setLoading(false);
        }
    };

    const onFilter = (event) => {
        const newFilters = {...lazyParams.filters, ...event.filters};
        setLazyParams(prevState => ({
            ...prevState,
            first: 0,  // Reset to first page when filters change
            page: 0,
            filters: newFilters
        }));
    };

    const handlePageChange = (event) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,  // Set the first index for the page
            rows: event.rows,    // Number of rows per page
            page: event.page // Update the page index (primereact uses 0-based, so add 1)
        });
    };

    const handleSortChange = (event) => {
        setLazyParams({
            ...lazyParams,
            sortField: event.sortField,
            sortOrder: event.sortOrder
        });
    };


    const renderHeader = () => {
        return (
            <div>
                <h4>Student Answer Sheet</h4>
            </div>
        );
    };

    const handleAssign = async () => {
            if (!selectedTeacher || selectedStudents.length === 0) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please select a teacher and at least one student.',
                    life: 3000
                });
                return;
            }

            const payload = {
                teacherId:  (selectedTeacher.id),
                answerScriptIds: selectedStudents.map(answerScriptId =>  (answerScriptId.id)),
            };

            try {
                console.log(payload)
                const response =
                    await axios.put('/ans-script-manager/assign-answer-script-to-teacher', payload,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                if(response.status===200){
                    toast.current.show({severity: 'success', summary: 'Assignment successful!', life: 3000});
                    setSelectedTeacher(null)
                    setAnswerScriptId([])
                }
            } catch
                (error) {
                console.error('Error during assignment:', error, "Payload:", payload);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to assign teacher to answerScriptId.',
                    life: 3000
                });
            }
        }
    ;

    const breadcrumbData = [
        {name: "Dashboard", url: "/teacher/dashboard"},
        {name: "Answer Script Teacher Mapping"},
    ];



    const header = renderHeader();

    return (
        <TeacherLayout breadcrumbItems={breadcrumbData}>
            <div>
                <div className="card p-lg-5">
                    <FloatLabel className="col-md-6">
                        <Dropdown inputId="dd-teacher"
                                  value={selectedTeacher}
                                  onChange={(e) => {
                                      setSelectedTeacher(e.value);
                                      setSelectedStudents([]);
                                  }}
                                  filterBy='name'
                                  filter
                                  options={teachers} optionLabel="name" showClear className="col-md-6"/>
                        <label htmlFor="dd-teacher">Select Teacher*</label>
                    </FloatLabel>
                    {selectedTeacher && (
                        <div className="mt-lg-5">
                            <DataTable value={answerScriptId} paginator
                                       filterDisplay="row"
                                       header={header}
                                       lazy
                                       totalRecords={totalRecords}
                                       rows={lazyParams.rows}
                                       first={lazyParams.first}
                                       onPage={handlePageChange}
                                       onSort={handleSortChange}
                                       sortField={lazyParams.sortField}
                                       sortOrder={lazyParams.sortOrder}
                                       loading={loading}
                                       dataKey="id"
                                       onFilter={onFilter}
                                       filters={lazyParams.filters}
                                       selectionMode="checkbox"
                                       selection={selectedStudents}
                                       onSelectionChange={(e) => setSelectedStudents(e.value)}
                                       emptyMessage="No answerScriptId found.">
                                <Column header="No."
                                        body={(rowData, options) => options.rowIndex + 1}
                                        headerStyle={{width: '3rem'}}/>
                                <Column selectionMode="multiple" headerStyle={{width: '3rem'}}></Column>
                                <Column field="paperName" header="Paper Name" filter filterPlaceholder="Search"
                                        showFilterMenu={false}/>
                                <Column field="answerScriptId" header="Answer Script ID" sortable/>
                                <Column field="evaluatorName" header="Evaluator Name"
                                        showFilterMenu={false}/>
                            </DataTable>
                        </div>
                    )}

                </div>
                <div className="row">
                    <div className="col-12">
                        <Toast ref={toast}/>
                        <button className="btn btn-primary" type="button" onClick={handleAssign}>Assign</button>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default AnswerScriptTeacherMapping