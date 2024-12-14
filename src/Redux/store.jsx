import {configureStore} from "@reduxjs/toolkit"
import webSocketReducer from "./webSocketSlice.jsx"
import questionBankReducer from "./mcqTypeQuestionSlice.jsx"
import selectTagOptionsReducer from "./selectTagOptionsSlice.jsx"
import sidebarReducer from "./sidebarSlice.jsx"
import questionDetailsReducer from "./questionDetailsSlice.jsx"


export const store = configureStore({
    reducer: {
        webSocket: webSocketReducer,
        mcqTypeQuestion : questionBankReducer,
        selectTagOptions: selectTagOptionsReducer,
        sidebar: sidebarReducer,
        questionDetails: questionDetailsReducer,
    },
});