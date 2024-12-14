import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {axios, CookieHelper, JWT_COOKIES_NAME} from "./PopUpAnnoationImports.jsx";
import {setQuestionDetails} from "../../../Redux/questionDetailsSlice.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";

const AnswerKeyPanel = ({questionsGroups, questionId, fieldName}) => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    let answersContent;
    const [slNo, setSlNo] = useState("");
    const [answerKeyObject, setAnswerKeyObject] = useState(null);
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const questionDetailsState = useSelector((state) => state.questionDetails);

    const onButtonClick = (question_id,sl_no) => {
        const cachedData = questionDetailsState[question_id];

        if (cachedData) {
            console.log("Using cached data:", cachedData);
            setSlNo(sl_no);
            setAnswerKeyObject(cachedData);
            setVisible(true);
        } else {
            axios.get("evaluation/question", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    question_id: question_id
                }
            }).then((res) => {
                const allData = res.data;
                console.log("Fetched data:", allData);
                dispatch(setQuestionDetails({ questionId: question_id, data: allData }));
                setAnswerKeyObject(allData);
                setSlNo(sl_no);
                setVisible(true);
            }).catch((error) => {
                console.error("Error fetching question details:", error);
            });
        }
    }

    useEffect(() => {
        if(questionId && fieldName){
            onButtonClick(questionId, fieldName)
        }
    },[questionId,fieldName])

    try {
        // Attempt to parse the answers field as JSON
        answersContent = answerKeyObject?.answers ? JSON.parse(answerKeyObject.answers) : "";
    } catch (error) {
        // If parsing fails, treat it as a plain string
        answersContent = answerKeyObject?.answers || "";
    }

  return (
      <div className="answer-key-panel">
          {!visible ? (
              <>
                  <div style={{borderBottom: "1px solid black", padding: "15px"}}>
                      <strong>Question & Answer</strong>
                  </div>
                  <div className="mt-2 px-4">
                      {questionsGroups?.map((group) =>
                          group?.questions?.map((question) => {
                              const question_id = `${question?.id}`;
                              const sl_no = `${group?.slNo}.${question?.slNo}`;
                              return (
                                  <button key={question.details}
                                          onClick={() => onButtonClick(question_id, sl_no)}
                                          className="answerkey-panel-slNo">{sl_no}</button>
                              )
                          })
                      )}
                  </div>
              </>
              ) : (
                  <>
                      <div className="d-flex justify-content-between align-items-center" style={{borderBottom: "1px solid black", padding: "15px"}}>
                          <strong>Selected Question: {slNo}</strong>
                          <button className="btn btn-outline-secondary px-2 py-0"
                                  onClick={() => setVisible(false)}><FontAwesomeIcon icon={faLeftLong}/></button>
                      </div>
                      <div className="mt-2 px-4">
                          <div className="my-2">
                              <b>Question :</b> {answerKeyObject?.question}
                          </div>
                          <div>
                              <b>Answer :</b> {typeof answersContent === "string" ? (
                              answersContent
                          ) : (answersContent.answer || "")}
                          </div>
                      </div>
                    </>
          )}
      </div>
  )
}
AnswerKeyPanel.propTypes ={
    questionsGroups: PropTypes.array.isRequired,
    questionId: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired
}
export default AnswerKeyPanel