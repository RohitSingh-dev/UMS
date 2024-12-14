import React from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlassMinus, faMagnifyingGlassPlus} from "@fortawesome/free-solid-svg-icons";


// Set worker URL to load PDFJS
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ScrollablePdfViewer extends React.Component {
    state = {
        numPages: null,
        scale: 0.5
    };

    onDocumentLoadSuccess = ({numPages}) => {
        this.setState({numPages});
    };

    zoomIn = () =>{
        let newScale = this.state.scale+0.1;
        this.setState({scale: newScale});
    }

    zoomOut = () =>{
        let newScale = this.state.scale-0.1;
        this.setState({scale: newScale});
    }




    render() {
        const {numPages} = this.state;
        const {file} = this.props;

        return (
            <div className="pdf-container position-relative">
                <div className="sticky-top top-0 zoomInOutBtn">
                    <NavLink to="#" className="ms-2" onClick={this.zoomIn}>
                        <FontAwesomeIcon icon={faMagnifyingGlassPlus}/>
                    </NavLink>
                    <NavLink to="#" className="ms-2" onClick={this.zoomOut}>
                        <FontAwesomeIcon icon={faMagnifyingGlassMinus}/>
                    </NavLink>
                </div>
                <Document
                    file={file}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                >
                    {[...Array(numPages).keys()].map(pageIndex => (
                        <Page key={`page-${pageIndex + 1}`} pageNumber={pageIndex + 1} scale={this.state.scale}/>
                    ))}
                </Document>

            </div>
        );
    }
}

export default ScrollablePdfViewer;
