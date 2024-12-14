import TeacherLayout from "../Teacher/TeacherLayout.jsx";
import {Controller, useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {FileUpload} from "primereact/fileupload";
import {Button} from "primereact/button";
import apiCall from "../../Axios/APIHelper.jsx";

const StudentAnswerUpload = () => {
    const {control, handleSubmit, formState: {errors}} = useForm();
    const [file, setFile] = useState(null);
    const [batchFile, setBatchFile] = useState(null);
    const alert = useRef(null)
    const [questions, setQuestions] = useState([])
    const [students, setStudents] = useState([])
    const fileUploadRef = useRef(null);

    const onFileSelect = (event) => {
        const selectedFile = event.files[0];

        if (selectedFile && selectedFile.type !== 'application/pdf') {
            alert.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Only PDF files are allowed!',
                life: 3000
            });
            fileUploadRef.current.clear();
            setFile(null);
            return;
        }

        setFile(selectedFile);
    };

    const onBatchFileSelect = (event) => {
        const selectedFile = event.files[0];
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

        if (fileExtension !== 'zip') {
            alert.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Only ZIP files are allowed!',
                life: 3000
            });
            fileUploadRef.current.clear();
            setBatchFile(null);
            return;
        }

        setBatchFile(selectedFile);
    };


    useEffect(() => {
        apiCall({
            url: '/search_data/question-papers',
            showLoadingIndicator: false
        })
            .then(data => {
                setQuestions(data)

            })
            .catch((error) => {
                alert.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data,
                    life: 3000
                });
            });
    }, [])


    const breadcrumbData = [
        {name: "Dashboard", url: "/teacher/dashboard"},
        {name: "Upload Answer"},
    ];


    const onSubmit = async (data) => {
        if (!file) {
            alert.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a answer sheet of the student',
                life: 3000
            });
            return;
        }

        const formData = new FormData();
        formData.append('question_paper', (data.question_paper));
        formData.append('student', (data.student));
        formData.append('file', file);

        apiCall({
            url: '/evaluation/upload/answer',
            method: 'post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(() => {
                alert.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: "Answer sheet upload successfully",
                    life: 3000
                });
                fileUploadRef.current.clear(); // Clear FileUpload UI
                setFile(null); // Clear file state
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };

    const onBatchSubmit = async () => {
        if (!batchFile) {
            alert.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a zip file',
                life: 3000
            });
            return;
        }

        // const formData = new FormData();
        // formData.append('file', batchFile);
        //
        // axios.post('/evaluation/upload/answer/bulk', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data', // Specify content type
        //         Authorization: `Bearer ${token}`
        //     },
        // })
        //     .then(response => {
        //         alert.current.show({
        //             severity: 'success',
        //             summary: 'Success',
        //             detail: "File upload successfully",
        //             life: 3000
        //         });
        //         // Reset batch file state
        //         setBatchFile(null);
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //     });

    };

    const onChangeQuestionPaper = (data, field) => {
        const decodedId = (data.value);
        apiCall({
            url: '/search_data/question-papers/students',
            method: 'get',
            params: {
                encryptedId: decodedId
            }
        })
            .then(responseData => {
                field.onChange(data.value)
                setStudents(responseData)

            })
            .catch((error) => {
                alert.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data,
                    life: 3000
                });
            });
    }

    return (
        <TeacherLayout breadcrumbItems={breadcrumbData} toastRef={alert}>
            <div className='card'>
                <div className="card-header mb-3">
                    <h5 className="card-title">Single Upload</h5>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className="form-group">
                                <label htmlFor="dropdown1">Question Paper</label>
                                <Controller
                                    name="question_paper"
                                    control={control}
                                    rules={{required: 'Question Paper is required'}}
                                    render={({field}) => (
                                        <Dropdown
                                            id="question_paper"
                                            value={field.value}
                                            options={questions}
                                            onChange={(e) => onChangeQuestionPaper(e, field)}
                                            placeholder="Select an option"
                                            optionLabel="label"
                                            filter='label'
                                            optionValue="id"
                                            className={`w-100 ${errors.question_paper && "p-invalid"}`}
                                        />
                                    )}
                                />
                                {errors.question_paper &&
                                    <small className="p-error">{errors.question_paper.message}</small>}
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="form-group">
                                <label htmlFor="dropdown1">Student</label>
                                <Controller
                                    name="student"
                                    control={control}
                                    rules={{required: 'student is required'}}
                                    render={({field}) => (
                                        <Dropdown
                                            id="student"
                                            value={field.value}
                                            options={students}
                                            filter='label'
                                            onChange={(e) => field.onChange(e.value)}
                                            placeholder="Select an option"
                                            optionLabel="label"
                                            optionValue="id"
                                            className={`w-100 ${errors.student && "p-invalid"}`}
                                        />
                                    )}
                                />
                                {errors.student && <small className="p-error">{errors.student.message}</small>}
                            </div>
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="fileUpload">Upload PDF File</label>
                        <FileUpload
                            className="answerUpload-fileUpload"
                            name="file"
                            customUpload
                            ref={fileUploadRef}
                            uploadHandler={onFileSelect}
                            onRemove={() => setFile(null)}
                            auto
                            accept=".pdf"
                            chooseOptions={{label: 'Upload File', className: 'btn-primary'}}
                        />
                    </div>
                    <div className="text-end mt-3">
                        <Button type="submit" label="Submit" value="submit" rounded raised className='btn-primary'/>
                    </div>
                </form>
            </div>
            <div className='card'>
                <div className="card-header mb-3">
                    <h5 className="card-title">Batch Upload</h5>
                </div>
                <form onSubmit={onBatchSubmit}>
                    <div className="p-field">
                        <label htmlFor="fileUpload">Upload ZIP File</label>
                        <FileUpload
                            className="answerUpload-fileUpload"
                            name="file"
                            customUpload
                            uploadHandler={onBatchFileSelect}
                            onRemove={() => setBatchFile(null)}
                            auto
                            accept=".zip"
                            chooseOptions={{label: 'Upload File', className: 'btn-primary'}}
                        />
                    </div>
                    <div className="text-end mt-3">
                        <Button type="submit" label="Submit" value="submit" rounded raised className='btn-primary'/>
                    </div>
                </form>
            </div>
        </TeacherLayout>
    )
}

export default StudentAnswerUpload