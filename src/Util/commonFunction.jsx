import axios from "axios";
import CookieHelper from "../services/UseCookies.jsx";
import {setMenus, setSidebarClass} from "../Redux/sidebarSlice.jsx";
import {JWT_COOKIES_NAME} from "./AppConstant.jsx";

export function logOut(navigate, disptch) {
  const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
  if (token) {
    axios
      .post(
        "auth/logout",
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          disptch(setMenus([]))
          disptch(setSidebarClass(''))
          CookieHelper.RemoveAll();
          localStorage.removeItem('openMenus');
          navigate("/");
        }
      });
  }
}
