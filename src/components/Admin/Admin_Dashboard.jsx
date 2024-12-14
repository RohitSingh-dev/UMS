import AdminLayout from "./AdminLayout.jsx";
import CookieHelper from "../../services/UseCookies.jsx";
import {USERNAME_COOKIES_NAME} from "../Util/AppConstant.jsx";

function AdminDashBoard() {
    const userNamme = CookieHelper.getCookie(USERNAME_COOKIES_NAME);
    const breadcrumbData = [
        {name: "Dashboard"},
    ];
    return (
        <AdminLayout breadcrumbItems={breadcrumbData} breadCrumbHeader={userNamme}>
            Hello Admin
        </AdminLayout>
    );
}

export default AdminDashBoard;
