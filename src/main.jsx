import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import {store} from "./Redux/store.jsx";
import {Provider} from 'react-redux'
import {LoadingProvider} from "./components/Util/LoadingContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <LoadingProvider>
                    <App/>
                </LoadingProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);
