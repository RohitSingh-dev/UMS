import {NavLink} from "react-router-dom";
import {LOAD_COURSE} from "../../../../Util/AppConstant.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import {useState} from "react";

const AttendanceSheet = ({handleTransition}) => {
    const currentCourse = useSelector(state => state.selectAttendanceOptions.activeCourse);
    const currentAcademicSession = useSelector(state => state.selectAttendanceOptions.activeAcademicSession)
    const [students, setStudents] = useState([
        { id: "BM22001", name: "Abhishek Dey", credit: "C", attendance: Array(20).fill(false) },
        { id: "BM22002", name: "Abhishek Mishra", credit: "C", attendance: Array(20).fill(false) },
        { id: "BM22003", name: "Alina Guha", credit: "C", attendance: Array(20).fill(false) },
        { id: "BM22004", name: "Amisha Kumari", credit: "C", attendance: Array(20).fill(false) },
        { id: "BM22005", name: "Anik Mallick", credit: "C", attendance: Array(20).fill(false) },
        { id: "BM22006", name: "Anirudh Kejariwal", credit: "C", attendance: Array(20).fill(false) },
        { id: "BM22007", name: "Anish Sengupta", credit: "C", attendance: Array(20).fill(false) },
        { id: "BM22008", name: "Ankita Pandey", credit: "C", attendance: Array(20).fill(false) },
        { id: "BM22009", name: "Anushka Das", credit: "C", attendance: Array(20).fill(false) },
        { id: "BM22010", name: "Anwesha Banerjee", credit: "C", attendance: Array(20).fill(false) },
    ]);

    // Toggle attendance for a student and session
    const toggleAttendance = (studentIndex, sessionIndex) => {
        const updatedStudents = [...students];
        updatedStudents[studentIndex].attendance[sessionIndex] =
            !updatedStudents[studentIndex].attendance[sessionIndex];
        setStudents(updatedStudents);
    };

    // Render a column for each session
    const sessionColumns = Array.from({ length: 20 }, (_, index) => {
        return (
            <Column
                key={`session-${index + 1}`}
                header={`${index + 1}`}
                body={(rowData, { rowIndex }) => (
                    <Checkbox
                        checked={rowData.attendance[index]}
                        onChange={() => toggleAttendance(rowIndex, index)}
                    />
                )}
                style={{ textAlign: "center", width: "50px" }}
            />
        );
    });

    return (
        <>
            <NavLink to='' onClick={() => handleTransition(LOAD_COURSE)}
                     className="back_to_previous">
                <FontAwesomeIcon icon={faArrowLeft}/> Back </NavLink>
            <div className="card">
                <div className="row">
                    <p className="col-md-6">
                        <b><span>Academic Session:&nbsp;</span></b>{currentCourse.name}
                    </p>
                    <p className="col-md-6">
                        <b><span>Course:&nbsp;</span></b>{currentAcademicSession.name}
                    </p>
                </div>
            </div>
            <div className="card">
                <DataTable value={students} stripedRows>
                    <Column
                        field="sno"
                        header="SNo"
                        body={(rowData, { rowIndex }) => rowIndex + 1}
                        style={{ width: "50px", textAlign: "center" }}
                    />
                    <Column
                        field="id"
                        header="Sid"
                        style={{ width: "100px", textAlign: "center" }}
                    />
                    <Column
                        field="name"
                        header="Student Name"
                        style={{ width: "200px", textAlign: "left" }}
                    />
                    <Column
                        field="credit"
                        header="C/A"
                        style={{ width: "50px", textAlign: "center" }}
                    />
                    {sessionColumns}
                </DataTable>
            </div>
            <button className="btn btn-primary-violet">
                Save
            </button>
        </>
    );
}
AttendanceSheet.propTypes ={
    handleTransition: PropTypes.func.isRequired
}

export default AttendanceSheet