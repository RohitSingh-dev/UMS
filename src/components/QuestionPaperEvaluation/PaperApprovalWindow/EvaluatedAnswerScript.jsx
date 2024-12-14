import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMaximize, faMinimize} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {ConfirmDialog} from "primereact/confirmdialog";
import {useScreenSize} from "../PaperEvaluationWindow/PopUpAnnoationImports.jsx";
import {TEACHER1_COMPARE_COLOR} from "../../Util/AppConstant.jsx";
import useDrag from "../../../hooks/useDrag.jsx"

const EvaluatedAnswerScript = ({background, allImages, activeImageIndex, teacher, givenMarks, onScroll, syncWithScroll, toast, zoomScale, imageRatio, fullMarks}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const scrollContainerRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [dialogType, setDialogType] = useState(""); // Track which button triggered the dialog
    const { containerRef, handleDragStart, handleDragMove, handleDragEnd, getDraggingCursor } = useDrag();
    const screenSize = useScreenSize()
    let height = screenSize.height

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleScroll = (e) => {
        if (onScroll) {
            onScroll(e.target.scrollTop, e.target.scrollLeft);
        }
    };

    // Update scroll position when syncWithScroll changes
    useEffect(() => {
        if (scrollContainerRef.current && syncWithScroll) {
            const { scrollTop, scrollLeft } = syncWithScroll;
            scrollContainerRef.current.scrollTop = scrollTop;
            scrollContainerRef.current.scrollLeft = scrollLeft;
        }
    }, [syncWithScroll]);

    const messageContent = dialogType === "approve"
        ? (
            <div>
                Are you sure you want to approve <strong>{teacher}</strong>&apos;s evaluation?<br />
                <span style={{fontSize: "14px", color: "red"}}>*Note: All other teacher&apos;s evaluated scripts will be automatically rejected.</span>
            </div>
        )
        : (
            <div>
                Are you sure you want to edit <strong>{teacher}</strong>&apos;s script?<br />
            </div>
        );

    const approve = () => {
        toast.current.show({ severity: 'success', summary: 'Approved', detail: `${teacher}'s evaluation has been approved.`, life: 3000 });
    }

    const editAndApprove = () => {
        toast.current.show({ severity: 'success', detail: `You are redirected to evaluate ${teacher}'s script`, life: 3000 });
    }

  return (
      <div className="evaluated-answer-script p-3"
           style={{background: background, borderRadius: background===TEACHER1_COMPARE_COLOR? '4px 0px 0px 4px': '0px 4px 4px 0px'}}>
          <div className="d-flex justify-content-between align-items-center" style={{lineHeight: "40px"}}>
              <strong>{teacher}</strong>
              <FontAwesomeIcon
                  icon={faMaximize}
                  onClick={toggleFullscreen}
                  title="Full Screen"
                  style={{ cursor: "pointer" }}
              />
          </div>
          {!isFullscreen ? (
              <div className="overflow-x-auto p-3" style={{textAlign: "center", cursor: "grab"}}
                   ref={(node) => {
                       scrollContainerRef.current = node;
                       containerRef.current = node;
                   }}
                   onScroll={handleScroll}
                   onMouseDown={handleDragStart}
                   onMouseMove={handleDragMove}
                   onMouseUp={handleDragEnd}
                   onMouseLeave={handleDragEnd}>
                  <img
                      src={allImages[activeImageIndex]}
                      width={(zoomScale * height) * imageRatio}
                      alt="Background"
                      height={(zoomScale * height)}
                      style={{
                          userSelect: "none",
                          cursor: getDraggingCursor(),
                          height: "fit-content",
                      }}
                      onContextMenu={(e) => e.preventDefault()} // Disable right-click context menu
                      onDragStart={(e) => e.preventDefault()} // Disable drag-and-drop
                  />
              </div>
          ) : (
              <div className="fullscreen-background-blur" style={{background: background}}>
                  <img
                      src={allImages[activeImageIndex]}
                      alt="Background"
                      style={{
                          width: "calc(100% - 200px)",
                          height: "fit-content",
                          userSelect: "none",
                          cursor: "inherit",
                      }}
                      onContextMenu={(e) => e.preventDefault()} // Disable right-click context menu
                      onDragStart={(e) => e.preventDefault()} // Disable drag-and-drop
                  />
                  <FontAwesomeIcon
                      icon={faMinimize}
                      onClick={toggleFullscreen}
                      style={{
                          cursor: "pointer",
                          color: "red",
                          position: "absolute",
                          right: "30px",
                          top: "20px",
                          fontSize: "20px"
                      }}
                      title="Minimize"
                  />
              </div>
          )}
          <div className="d-flex justify-content-between align-items-center mt-3">
              <strong>Marks: {givenMarks}/{fullMarks}</strong>
              <div>
                  <Toast ref={toast}/>
                  <ConfirmDialog
                      group="declarative"
                      visible={visible}
                      onHide={() => setVisible(false)}
                      message={messageContent}
                      header={dialogType === "approve" ? "Confirmation" : "Warning"}
                      icon="pi pi-exclamation-triangle"
                      accept={dialogType === "approve" ? approve : editAndApprove}
                      acceptLabel={dialogType === "approve" ? "Approve" : "Edit and Approve"}
                      rejectLabel="Cancel"
                      acceptClassName="btn btn-success"
                      rejectClassName="btn btn-secondary mx-3"
                      style={{ width: '50vw' }}
                      breakpoints={{ '1100px': '75vw', '960px': '100vw' }}
                  />
                  <Button className="btn btn-success evaluated-answer-script-btn mx-3"
                          onClick={() => {setVisible(true); setDialogType("approve");}}>
                      Approve
                  </Button>
                  <Button className="evaluated-answer-script-btn"
                          onClick={() => {setVisible(true); setDialogType("editAndApprove");}}>
                      Edit and Approve
                  </Button>
              </div>
          </div>
      </div>
  )
}
EvaluatedAnswerScript.propTypes ={
    background: PropTypes.string.isRequired,
    allImages: PropTypes.array.isRequired,
    activeImageIndex: PropTypes.number.isRequired,
    teacher: PropTypes.string.isRequired,
    givenMarks: PropTypes.number.isRequired,
    onScroll: PropTypes.func.isRequired,
    syncWithScroll: PropTypes.shape({
        scrollTop: PropTypes.number.isRequired,
        scrollLeft: PropTypes.number.isRequired
    }),
    toast: PropTypes.any.isRequired,
    zoomScale: PropTypes.number.isRequired,
    imageRatio: PropTypes.number.isRequired,
    fullMarks: PropTypes.number.isRequired
}
export default EvaluatedAnswerScript