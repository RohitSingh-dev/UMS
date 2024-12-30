// ProgressModal.js
import ReactModal from 'react-modal';
import 'react-circular-progressbar/dist/styles.css';
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";


ReactModal.setAppElement('#root');
const Modal = ({children, isOpen, changeModalStatus, onRequestClose, width = "300px", height = "300px"}) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: width, // Adjust as needed
                    height: height, // Adjust as needed
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: "",
                    border: 'none',
                    overflow: 'none',
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                }
            }}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '30px'
            }}>

                <FontAwesomeIcon icon={faTimes} onClick={() => {
                    if (isOpen) {
                        changeModalStatus(false)
                    }
                }} className="crossIcon"/>
                {children}
            </div>
        </ReactModal>
    );
};

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    changeModalStatus: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
}

export default Modal;
