import TeacherLayout from "../../Teacher/TeacherLayout.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import CookieHelper from "../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../Util/AppConstant.jsx";
import {useLocation} from "react-router-dom";
import LinkButton from "../LinkButton.jsx";
import {useSelector} from "react-redux";

const Report = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const [actionButtons, setActionButtons] = useState([])
    const menus = useSelector((state) => state.sidebar.menus);

    const location = useLocation();

    // Extract the current path
    const currentMenu = menus.filter(menu => menu.path === location.pathname).at(0)



    const breadcrumbData = [
        {name: "Dashboard", url: "/teacher/dashboard"},
        {name: "Report"},
    ];

    useEffect(() => {
        axios.get('/user/action_buttons', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                id: currentMenu.id
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setActionButtons(response.data)
                }
            })
            .catch((error) => {
                console.log(error)
            });

    }, [currentMenu])

    return (
        <TeacherLayout breadcrumbItems={breadcrumbData}>
            <div className='row'>
                {actionButtons.map((actionButton) => (
                    <LinkButton name={actionButton.name} url={actionButton.path} key={actionButton.id}/>
                ))}
            </div>
        </TeacherLayout>
    )
}

export default Report