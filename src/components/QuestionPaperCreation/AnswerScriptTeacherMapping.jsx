import TeacherLayout from "../Teacher/TeacherLayout.jsx";
import {Dropdown} from 'primereact/dropdown';
import {FloatLabel} from 'primereact/floatlabel';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {useRef, useState} from "react";
import axios from "axios";

const AnswerScriptTeacherMapping = () => {
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const toast = useRef(null);
    const teachers = [
        {id: 1, name: 'Rahul Singh'},
        {id: 2, name: 'Dhiraj Gupta'},
        {id: 3, name: 'Krishna Sah'},
        {id: 4, name: 'Amit Kumar Singh'},
        {id: 5, name: 'Debjit Mondal'}
    ];

    const [students] = useState([
        {id: 1, name: 'Anshuman Jha', answerScriptId: 654759},
        {id: 2, name: 'Archana Kumari', answerScriptId: 654756},
        {id: 3, name: 'Jayant Sah', answerScriptId: 654752},
        {id: 4, name: 'Sumit Kumar', answerScriptId: 654751},
        {id: 5, name: 'Anjali Kumari', answerScriptId: 654750}
    ]);

    const renderHeader = () => {
        return (
            <div>
                <h4>Student Answer Script Data</h4>
            </div>
        );
    };

    const handleAssign = async () => {
        if (!selectedTeacher || selectedStudents.length === 0) {
            toast.current.show({severity:'error', summary: 'Error', detail:'Please select a teacher and at least one student.', life: 3000});
            return;
        }

        const payload = {
            teacherId: selectedTeacher.id,
            studentIds: selectedStudents.map(student => student.id),
        };

        try {
            const response = await axios.post('/api/assign-teacher', payload);
            console.log('Assignment successful', response.data);
            toast.current.show({severity:'success', summary: 'Assignment successful!', life: 3000});
        } catch (error) {
            console.error('Error during assignment:', error, "Payload:", payload);
            toast.current.show({severity:'error', summary: 'Error', detail:'Failed to assign teacher to students.', life: 3000});
        }
    };

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
                                  options={teachers} optionLabel="name" showClear className="col-md-6"/>
                        <label htmlFor="dd-teacher">Select Teacher*</label>
                    </FloatLabel>
                    {selectedTeacher && (
                        <div className="mt-lg-5">
                            <DataTable value={students} paginator header={header} rows={10}
                                       dataKey="id" selectionMode="checkbox"
                                       selection={selectedStudents}
                                       onSelectionChange={(e) => setSelectedStudents(e.value)}
                                       emptyMessage="No students found."
                                       currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                       paginatorTemplate="CurrentPageReport PrevPageLink PageLinks NextPageLink">
                                <Column selectionMode="multiple" headerStyle={{width: '3rem'}}></Column>
                                <Column field="name" header="Student Name" sortable/>
                                <Column field="answerScriptId" header="Answer Script ID" sortable/>
                            </DataTable>
                        </div>
                    )}

                </div>
                <div className="row">
                    <div className="col-12">
                        <Toast ref={toast} />
                        <button className="btn btn-primary" type="button" onClick={handleAssign}>Assign</button>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default AnswerScriptTeacherMapping