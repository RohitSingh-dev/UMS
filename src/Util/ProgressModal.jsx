// ProgressModal.js
import ReactModal from 'react-modal';
import 'react-circular-progressbar/dist/styles.css';
import PropTypes from "prop-types";
import {Hypnosis} from "react-cssfx-loading";
import {ProgressBar} from "primereact/progressbar";

ReactModal.setAppElement('#root');
const ProgressModal = ({isOpen, onRequestClose, progress, progressStatus}) => {
    const valueTemplate = () => {
        return (
            <>

            </>
        );
    };

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
                    width: '300px', // Adjust as needed
                    height: '300px', // Adjust as needed
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: "",
                    border: 'none'
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
                borderRadius: '16px'
            }}>
                <div style={{position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, 0%)'}}>
                    <Hypnosis height={100} width={100} style={{borderWidth: "10px"}} cols="#06a5ff"/>
                </div>
                <div style={{position: 'absolute', top: '65%', left: '0%', width: "100%"}}>
                    <ProgressBar value={progress} displayValueTemplate={valueTemplate}
                                 style={{width: "90%", margin: '10px', height: '10px'}}/>
                    <h1 style={{
                        textAlign: 'center',
                        fontSize: '25px',
                        fontWeight: '400'
                    }}>{progressStatus}...</h1>
                </div>
            </div>
        </ReactModal>
    );
};

ProgressModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    progress: PropTypes.number.isRequired,
    progressStatus: PropTypes.string
}

export default ProgressModal;
