import AdminLayout from "../../AdminLayout.jsx";
import {useRef, useState} from "react";
import {LOAD_COURSE} from "../../../../Util/AppConstant.jsx";
import SearchCourse from "./SearchCourse.jsx";
import AttendanceSheet from "./AttendanceSheet.jsx";

const AttendancePage = () => {
    const toast = useRef(null);
    const [currentStep, setCurrentStep] = useState(LOAD_COURSE);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "Attendance Sheet"}
    ];

    const handleTransition = (nextStep) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(nextStep);
            setIsTransitioning(false);
        }, 500);
    };

  return (
      <AdminLayout breadcrumbItems={breadcrumbData}>
          <div className={`animation-container ${isTransitioning ? 'fade-exit' : 'fade-enter'}`}>
              {
                  currentStep === LOAD_COURSE
                  ?
                      (<SearchCourse toast={toast} handleTransition={handleTransition} />)
                      :
                      (<AttendanceSheet handleTransition={handleTransition}/>)
              }
          </div>
      </AdminLayout>
  )
}

export default AttendancePage