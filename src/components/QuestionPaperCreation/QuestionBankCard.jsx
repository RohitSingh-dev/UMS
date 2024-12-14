import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import {NavLink} from "react-router-dom";

const QuestionBankCard = ({
                              children,
                              btnName,
                              onClick,
                              header,
                              onActionButtonClick,
                              isTransitioning = false,
                              isButtonDisabled = false
                          }) => {
    return (
        <>
            <div className="row mt-4">
                <div className="col-lg-12 col-md-12">
                    <div className={`card animation-container ${isTransitioning ? 'left-exit' : 'right-enter'}`}>
                        <div className="card-header d-flex justify-content-between">
                            {header &&
                                <h5 className="card-title">{header}</h5>
                            }
                            {
                                onActionButtonClick &&
                                <NavLink to="javascript:void(0)" onClick={onActionButtonClick}> <FontAwesomeIcon
                                    icon={faPen}/> </NavLink>
                            }
                        </div>


                        <div className="card-body">
                            <div className="row mt-3">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                btnName && (
                    btnName !== '' ?
                        <div className="row">
                            <div className="col-12">
                                <button className="btn btn-primary" type="button" onClick={onClick}
                                        disabled={isButtonDisabled}>
                                    {btnName}
                                </button>
                            </div>
                        </div>
                        :
                        <></>
                )
            }
            {/*<div className='card p-2 mt-2'>*/}
            {/*    <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>*/}
            {/*</div>*/}
        </>
    )
}
QuestionBankCard.propTypes = {
    children: PropTypes.node.isRequired,
    btnName: PropTypes.string,
    header: PropTypes.string,
    onClick: PropTypes.func,
    isButtonDisabled: PropTypes.bool,
    onActionButtonClick: PropTypes.func,
    isTransitioning: PropTypes.bool
};
export default QuestionBankCard