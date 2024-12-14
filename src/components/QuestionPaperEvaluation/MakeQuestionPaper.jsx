import {useForm} from "react-hook-form";
import {useState} from "react";
import {Button, Card} from "react-bootstrap";
import axios from "axios";
import CookieHelper from "../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../Util/AppConstant.jsx";
import TeacherLayout from "../Teacher/TeacherLayout.jsx";

function MakeQuestionPaper() {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [result, setResult] = useState();

    const formSubmit = (data) => {
        const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
        const formData = new FormData();
        formData.append("file", data.file[0]);
        console.log(formData);
        axios.post("generateQuestionPaper/upload", formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            }
        ).then((response) => {
            console.log(response)
        })
            .catch((error) => {
                console.log(error)
            });
    };

    return (
        <TeacherLayout>
            <form onSubmit={handleSubmit(formSubmit)}>
                <Card>
                    <Card.Header>Question Paper</Card.Header>
                    <Card.Body>
                        <div className="form-group">
                            <label htmlFor="question_paper">Upload Question paper</label>
                            <input
                                className="form-control"
                                type="file"
                                accept=".xlsx"
                                id="question_paper"
                                {...register("file", {
                                    required: "Please upload a PDF file",
                                    validate: {
                                        isXLSX: (value) => {
                                            return (
                                                value && value[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                            ) || "Only XLSX files are allowed";
                                        }
                                    }
                                })}
                            />
                            {errors.file && <p>{errors.file.message}</p>}
                        </div>
                    </Card.Body>
                </Card>
                <Button type="submit">Submit</Button>
            </form>
        </TeacherLayout>
    );
}

export default MakeQuestionPaper;
