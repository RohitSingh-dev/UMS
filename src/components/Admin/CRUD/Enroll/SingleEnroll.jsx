import AdminLayout from "../../AdminLayout";
import { useState } from "react";
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const SingleEnroll = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showStudentInfo, setShowStudentInfo] = useState(false); // State to show/hide section

    const students = [
        { name: '01 - BUNDU BANGI', id: '#001', gender: 'Male', gpa: 0.00, credits: 0 },
        { name: '02 - JOHN DOE', id: '#002', gender: 'Male', gpa: 3.2, credits: 30 },
    ];

    const breadcrumbData = [
        { name: "Dashboard", url: '/admin/dashboard' },
        { name: "Master Settings", url: '/admin/crud' },
        { name: "Single Enroll" }
    ];

    const handleSearch = () => {
        if (selectedStudent) {
            setShowStudentInfo(true); // Show the student info section
        } else {
            setShowStudentInfo(false); // Hide section if no selection
        }
    };

    return (
        <AdminLayout breadcrumbItems={breadcrumbData}>
            <div className='card single-enroll-card'>
                <h5 className="title">Single Enroll</h5>
                <div className="form-group">
                    <label htmlFor="studentDropdown" className="label">
                        Student ID <span className="required">*</span>
                    </label>
                    <div className="dropdown-container">
                        <Dropdown
                            id="studentDropdown"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.value)}
                            options={students}
                            optionLabel="name"
                            placeholder="Select"
                            className="dropdown-field"
                        />
                        <Button
                            label="Search"
                            icon="pi pi-search"
                            className="search-button"
                            onClick={handleSearch}
                        />
                    </div>
                </div>

                {/* Conditional Section */}
                {showStudentInfo && selectedStudent && (
                    <>
                    <div className="student-info">
                        <div className="row">
                            <div className="col-6">
                                <h6>BASIC INFO</h6>
                                <p><strong>Student ID:</strong> {selectedStudent.id}</p>
                                <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                                <p><strong>Total Credits:</strong> {selectedStudent.credits}</p>
                                <p><strong>Cumulative GPA:</strong> {selectedStudent.gpa.toFixed(2)}</p>
                            </div>
                            <div className="col-6">
                                <h6>ACADEMIC INFORMATION</h6>
                                <p><strong>Batch:</strong> 2024-2025</p>
                                <p><strong>Program:</strong> BE Civil</p>
                                <p><strong>Session:</strong> mmmm</p>
                                <p><strong>Semester:</strong> com-sem-1</p>
                                <p><strong>Section:</strong> computer programming</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                    <h6>Current Session: mmmm | com-sem-1 | computer programming</h6>
                    <table>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Course</th>
                                <th>Credit Hours</th>
                                <th>Point</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Term Total</td>
                                <td></td>
                                <td>0</td>
                                <td>0.00</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default SingleEnroll;
