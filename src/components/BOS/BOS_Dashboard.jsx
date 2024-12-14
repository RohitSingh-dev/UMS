import {Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileInvoice, faUserCheck} from "@fortawesome/free-solid-svg-icons";
import EChartsReact from "echarts-for-react";
import BOSLayout from "./BOSLayout.jsx";
import BOSDashboardInfoCard from "./BOSDashboardInfoCard.jsx";

function BOSDashBoard() {
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: 'center',
            right: '5%',
            orient: "vertical",
            icon: "circle"
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 1
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 1048, name: 'Unregistered'},
                    {value: 735, name: 'Registered'},
                ]
            }
        ]
    };
    const breadcrumbData = [
        {name: "Dashboard"},
    ];
    return (
        <BOSLayout breadcrumbItems={breadcrumbData} breadCrumbHeader="Welcome BOS">
            <Row>
                <BOSDashboardInfoCard header='Students Registered' footer="Today's count 98 Students"
                                          onClick={() => console.log("Res")}>
                    <EChartsReact option={option} style={{height:'150px'}}/>
                </BOSDashboardInfoCard>
                <BOSDashboardInfoCard footer="Last Enrolled on 20-10-2021" header="Students Enrolled"
                                          onClick={() => console.log("Res1")}>
                    <div className="d-flex">
                        <div className='assignmens-icon'>
                            <FontAwesomeIcon icon={faUserCheck} className='color-blue'/>
                        </div>
                        <div className='flex-column d-flex justify-content-center'>
                            <p className='m-0'>
                                <span className='font-40 color-black bold-text ml-2'>
                                    300
                                </span>
                            </p>
                        </div>
                    </div>
                </BOSDashboardInfoCard>
                <BOSDashboardInfoCard footer="Last Form Fillup on 20-10-2021" header="Form Fillup Done"
                                          onClick={() => console.log("Res2")}>
                    <div className="d-flex">
                        <div className='from-fill-up-icon'>
                            <FontAwesomeIcon icon={faFileInvoice} className='color-orange-lite'/>
                        </div>
                        <div className='flex-column d-flex justify-content-center'>
                            <p className='m-0 font-12'> No of Student</p>
                            <p className='m-0'>
                                <span className='font-40 color-black bold-text ml-2'>
                                    500
                                </span>
                            </p>
                        </div>
                    </div>
                </BOSDashboardInfoCard>

            </Row>
        </BOSLayout>
    );
}

export default BOSDashBoard;
