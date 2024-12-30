import TeacherLayout from "./TeacherLayout.jsx";
import {Row} from "react-bootstrap";
import TeacherDashboardInfoCard from "./TeacherDashboardInfoCard.jsx";
import EChartsReact from "echarts-for-react";
import {useEffect, useState} from "react";
import commonFunctionService from "../../services/commonFunctionService.jsx";
import axios from "axios";
import CookiesHelper from "../../services/UseCookies.jsx";
import apiCall from "../../Axios/APIHelper.jsx";
import {JWT_COOKIES_NAME} from "../../Util/AppConstant.jsx";

function TeacherDashBoard() {
    const token = CookiesHelper.getCookie(JWT_COOKIES_NAME);

    const [dashboardData, setDashboardData] = useState({
        online: [
            {value: 0, name: 'Assign'},
            {value: 0, name: 'Evaluated'},
        ],
        question: [
            {value: 0, name: 'Assign'},
            {value: 0, name: 'Submitted'},
        ],
        moderation: [
            {value: 0, name: 'Assign'},
            {value: 0, name: 'Moderated'},
        ],
    });

    useEffect(() => {
        apiCall({
            url: '/teacher/dashboard',
            method: 'get',
            retryOnTokenExpired: true
        })
            .then((data) => {
                console.log(data)
                setDashboardData(data)
            })
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
            })
    }, [])

    const createChartOptions = (data) => ({
        tooltip: {
            trigger: 'item',
        },
        legend: {
            top: 'center',
            right: '5%',
            orient: "vertical",
            icon: "circle",
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                color: commonFunctionService.getRandomTwoColorsForPieChart(),
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 1,
                },
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: false,
                },
                data: data,
            },
        ],
    });

    const breadcrumbData = [
        {name: "Dashboard"},
    ];

    return (
        <TeacherLayout breadcrumbItems={breadcrumbData}>
            <Row>
                <TeacherDashboardInfoCard
                    header="Question Bank"
                    onClick={() => console.log("Question Bank clicked")}
                >
                    <EChartsReact
                        option={createChartOptions(dashboardData.question)}
                        style={{height: '150px'}}
                    />
                </TeacherDashboardInfoCard>
                <TeacherDashboardInfoCard
                    header="Question Moderation"
                    onClick={() => console.log("Question Moderation clicked")}
                >
                    <EChartsReact
                        option={createChartOptions(dashboardData.moderation)}
                        style={{height: '150px'}}
                    />
                </TeacherDashboardInfoCard>
                <TeacherDashboardInfoCard
                    header="Online Evaluations"
                    onClick={() => console.log("Online Evaluations clicked")}
                >
                    <EChartsReact
                        option={createChartOptions(dashboardData.online)}
                        style={{height: '150px'}}
                    />
                </TeacherDashboardInfoCard>
            </Row>
        </TeacherLayout>
    );
}

export default TeacherDashBoard;
