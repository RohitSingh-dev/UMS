import Cookies from "js-cookie";
import encryption from "./encryption.jsx";

class CookieHelper {
    static setCookies(value, key) {
        let encryptedValue = encryption.encrypt(value)
        Cookies.set(key, encryptedValue, {
            expires: 1,
        });
    }

    static getCookie(key) {
        return encryption.decrypt(Cookies.get(key));
    }

    static RemoveCookie(token) {
        Cookies.remove(token);
    }
    static RemoveAll(){
        const allCookies = Cookies.get(); // Get all cookies as an object

        Object.keys(allCookies).forEach(cookieName => {
            CookieHelper.RemoveCookie(cookieName); // Remove each cookie
        });
    }
}

export default CookieHelper;
