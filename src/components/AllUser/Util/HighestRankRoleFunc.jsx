import CookieHelper from "../../../services/UseCookies.jsx";

import {
    ROLE_ADMIN,
    ROLE_BOS,
    ROLE_COOKIES_NAME,
    ROLE_STUDENT,
    ROLE_SUPER_ADMIN,
    ROLE_TEACHER
} from "../../../Util/AppConstant.jsx";

export function HighestRankRoleFunc() {
    const getRoleFromCookies = () => {
        const role = CookieHelper.getCookie(ROLE_COOKIES_NAME);
        if (role) {
            return JSON.parse(role);
        }
        return null;
    };
    const role = getRoleFromCookies();

    console.log("role",role)

    if (role != null) {
        switch (role.authority) {
            case ROLE_STUDENT:
                return "/student/dashboard";
            case ROLE_ADMIN:
                return "/admin/dashboard";
            case ROLE_SUPER_ADMIN:
                return "/admin/dashboard";
            case ROLE_TEACHER:
                return "/teacher/dashboard";
            case ROLE_BOS:
                return "/bos/dashboard";
            default:
                return "/";
        }
    }

    return "/";

}