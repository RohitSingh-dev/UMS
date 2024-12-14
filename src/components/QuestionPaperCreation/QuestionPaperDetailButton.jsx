import {Component} from "react";
import {NavLink} from "react-router-dom";
import checkBox from "../../assets/img/check-box.png";
import blackCheckBox from "../../assets/img/blank-check-box.png";
import * as PropTypes from "prop-types";

class QuestionPaperDetailButton extends Component {
    render() {
        return <NavLink
            className={`card question_paper_card ${this.props.data.isComplete ? "complete" : ""}`}
            onClick={this.props.onClick} to=""
        >
            <div
                className="question_paper_progress_bar"
                style={
                    this.props.data.isComplete ?
                        {}
                        :
                        this.props.data.completed_percentage > 0 ?
                            {
                                width: `${this.props.data.completed_percentage}%`,
                                backgroundColor: "rgba(0, 123, 255, 0.2)"
                            }
                            :
                            {
                                width: `0.4%`,
                                backgroundColor: "rgba(231,162,38,0.84)"
                            }
                }
            ></div>

            <div className="d-flex gap-3 ">
                <div>
                    <img src={this.props.data.isComplete ? checkBox : blackCheckBox}
                         height="45px"
                         alt="ff"/>
                </div>
                <div
                    className="w-100 d-flex justify-content-between align-items-center flex-column flex-xl-row flex-md-column">
                    <div>
                        <h4 className="m-0">{this.props.data.paperName}</h4>
                        <h6 className="color-black m-0"
                            title="Course Code : Semester : Academic Year">{this.props.data.paperCode} : {this.props.data.semester} : {this.props.data.session} : {this.props.data.activity_name}</h6>
                    </div>
                    <p className="m-0"><label className="bold-text me-2">Last
                        Date: </label><span>{this.props.data.lasDateOfModeration}</span></p>
                </div>
            </div>
        </NavLink>;
    }
}

QuestionPaperDetailButton.propTypes = {
    data: PropTypes.any,
    onClick: PropTypes.func
};

export default QuestionPaperDetailButton