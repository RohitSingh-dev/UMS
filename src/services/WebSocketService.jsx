// WebSocketService.js

import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {store} from "../Redux/store.jsx";
import {updateBackendProgress, updateBackendProgressStatus} from "../Redux/webSocketSlice.jsx";
import CookieHelper from "./UseCookies.jsx";

import {JWT_COOKIES_NAME, USERNAME_COOKIES_NAME} from "../Util/AppConstant.jsx";

class WebSocketService {
    constructor() {
        this.stompClient = null;
    }

    connect() {
        const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
        const userName = CookieHelper.getCookie(USERNAME_COOKIES_NAME);
        const socket = new SockJS(`${import.meta.env.VITE_BASE_URl}ws?token=${token}`);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
            },
            onConnect: () => {
                this.stompClient.subscribe(`/user/${userName}/queue/progress`, (message) => {
                    let data = JSON.parse(message.body)
                    store.dispatch(updateBackendProgress(data.percentage))
                    store.dispatch(updateBackendProgressStatus(data.status))
                });
            },
        });

        this.stompClient.activate();
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.deactivate();
        }
    }

    sendMessage(destination, message) {
        if (this.stompClient !== null) {
            this.stompClient.publish({
                destination: destination,
                body: message,
            });
        }
    }
}

const webSocketService = new WebSocketService();

export default webSocketService;
