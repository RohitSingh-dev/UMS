import axios from "axios";
import CookieHelper from "../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "./AppConstant";
import {setMenus} from "../../Redux/sidebarSlice.jsx";

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
          CookieHelper.RemoveAll();
          navigate("/");
        }
      });
  }
}
