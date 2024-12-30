import AdminLayout from "./AdminLayout.jsx";
import CookieHelper from "../../services/UseCookies.jsx";

import { USERNAME_COOKIES_NAME } from "../../Util/AppConstant.jsx";

function AdminDashBoard() {
    const userName = CookieHelper.getCookie(USERNAME_COOKIES_NAME);
    const breadcrumbData = [
        { name: "Dashboard" },
    ];

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} breadCrumbHeader={userName}>
            Hello Admin
        </AdminLayout>
    );
}

export default AdminDashBoard;
