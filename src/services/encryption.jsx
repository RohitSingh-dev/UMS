import * as CryptoJS from "crypto-js";

class Encryption {

    static KEY = "fadhbjujeBDFREJHWERF 5855685*5258$%^&345"
    static IV = "asdasdasdasdas"

    static encrypt(text) {
        let iv = CryptoJS.enc.Utf8.parse(this.IV);
        let kye = CryptoJS.enc.Utf8.parse(this.KEY);
        return CryptoJS.AES.encrypt(text, kye, {
            iv: iv
        }).toString();
    }

    static decrypt(encryptedText) {
        try {
            let iv = CryptoJS.enc.Utf8.parse(this.IV);
            let kye = CryptoJS.enc.Utf8.parse(this.KEY);
            const decrypted = CryptoJS.AES.decrypt(encryptedText, kye, {
                iv: iv
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (ex) {
            return "Error"
        }
    }
}

export  default  Encryption