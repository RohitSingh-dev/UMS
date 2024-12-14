import CookieHelper from "../../../services/UseCookies.jsx";
import {ROLE_ADMIN, ROLE_BOS, ROLE_COOKIES_NAME, ROLE_STUDENT, ROLE_TEACHER} from "../../Util/AppConstant.jsx";

export function HighestRankRoleFunc() {

    const getRoleFromCookies = () => {
        const role = CookieHelper.getCookie(ROLE_COOKIES_NAME);
        if (role) {
            return JSON.parse(role);
        }
        return null;
    };
    const roles = getRoleFromCookies();

    if (roles && roles.length > 0) {
        const highestRankRole = roles.reduce((prev, current) =>
            prev.rank > current.rank ? prev : current
        );

        switch (highestRankRole.authority) {
            case ROLE_STUDENT:
                return "/student/dashboard";
            case ROLE_ADMIN:
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