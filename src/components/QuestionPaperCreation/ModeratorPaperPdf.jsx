// PdfModal.js
import {Dialog} from 'primereact/dialog';
import PropTypes from "prop-types";

const ModeratorPaperPdfViewer = ({pdfLink, isVisible, onClose, header}) => {
    return (
        <Dialog
            header={header}
            visible={isVisible}
            style={{width: '80vw', height: '80vh'}} // Adjust size accordingly
            onHide={onClose} // Close the modal
            modal
            maximizable // Allow users to maximize
        >
            {/* Display PDF if link exists */}
            {pdfLink ? (
                <iframe
                    src={pdfLink}
                    title="PDF"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                />
            ) : (
                <p>Loading PDF...</p>
            )}
        </Dialog>
    );
};

ModeratorPaperPdfViewer.propTypes = {
    pdfLink: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired
}

export default ModeratorPaperPdfViewer;
