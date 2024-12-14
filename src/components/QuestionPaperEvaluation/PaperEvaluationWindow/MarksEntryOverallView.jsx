import axios from "axios";
import MyTree from "../../Util/MyTree.jsx";
import {Row} from "react-bootstrap";
import {useEffect, useState} from 'react';
import styles from './Subject.module.css';
import {useLocation} from "react-router-dom";
import {ScrollPanel} from 'primereact/scrollpanel';
import {JWT_COOKIES_NAME} from "../../Util/AppConstant.jsx";
import CookiesHelper from "../../../services/UseCookies.jsx";

function MarksEntryOverallView() {
    const location = useLocation();
    const {answerSheetId} = location.state || {};
    const token = CookiesHelper.getCookie(JWT_COOKIES_NAME);
    const [data, setData] = useState(null)
    const [feedBack, setFeedBack] = useState('')


    useEffect(() => {
        axios.get("evaluation/getMarksDetails", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: {
                answerScriptId: answerSheetId
            }
        }).then((res) => {
            if (res.status === 200) {
                console.log(res.data)
                setData(res.data)
            }
        })
            .catch((ex) => console.log(ex))
    }, [])


    const closeTheWindow = () => {
        const formData = new FormData();
        formData.append('answerScriptId', answerSheetId)
        formData.append('feedback', feedBack)

        axios.post("evaluation/final-submit",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    if (window.closingWithButton) {
                        window.closingWithButton();
                    }
                    if (window.opener && !window.opener.closed) {
                        window.opener.updateStudentData({ answerSheetId, obtainMark: data['total'] })
                    }
                    window.close()
                }
            })
            .catch((ex) => console.log(ex))
    }

    return (
        <div className={`${styles['centred_card']} p-3`}>
            {data == null ?
                <h2>Loading...</h2>
                :
                (
                    <>
                        <Row>
                            <div className={styles.title}>
                                <h4>Subject: <span
                                    className={styles['subject-title']}>{data['subject']}</span></h4>
                                <h4>Answer Script Id: <span
                                    className={styles['subject-title']}>{data['answerScriptId']}</span>
                                </h4>
                                <h4>Duration: <span
                                    className={styles['subject-title']}>{data['duration']}</span></h4>
                            </div>
                        </Row>
                        <div className="row">
                            <div className='col-md-8 marks-overall-view'>
                                <div className={styles.card} style={{borderRadius: '4px'}}>
                                    <ScrollPanel style={{width: '100%', height: '80vh'}} className={styles.custombar1}>
                                        <MyTree data={data['allQuestionDetails']}/>
                                    </ScrollPanel>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="h-100 d-flex flex-column justify-content-between">
                                    <div className={styles['grand-total-container']}>
                                        <h2>GRAND TOTAL</h2>
                                        <div className={styles['total-number']}>{data['total']}</div>
                                        <div className={styles['total-text']}>{data['total_string']}</div>
                                    </div>
                                   <div>
                                       <div className={styles['feedback-container']}>
                                           <textarea placeholder="Feedback (Optional)..." className='w-100'
                                              onChange={(e) => setFeedBack(e.target.value)} maxLength={300}></textarea>
                                       </div>
                                       <div>
                                           <button className="btn btn-primary"
                                                   onClick={() => closeTheWindow()}>Finish
                                           </button>
                                       </div>
                                   </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

        </div>
    );
}

export default MarksEntryOverallView;