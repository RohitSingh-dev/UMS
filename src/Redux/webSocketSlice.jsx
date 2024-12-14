import {createSlice} from "@reduxjs/toolkit";

const webSocketSlice = createSlice({
    name: 'webSocket',
    initialState: {
        backendProgress: 0,
        backendProgressStatus: null,
        notificationMessage: []
    },
    reducers: {
        updateBackendProgress: (state, action) => {
            state.backendProgress = action.payload
        },
        updateBackendProgressStatus: (state, action) => {
            state.backendProgressStatus = action.payload
        },
        updateNotificationMessage:(sate, action)=>{
            sate.notificationMessage.push(action.payload)
        },
        resetProgress : (state)=>{
            state.backendProgress=0
            state.backendProgressStatus=''
        }
    }
})

export const {
    updateBackendProgress,
    updateBackendProgressStatus,
    resetProgress,
    updateNotificationMessage} = webSocketSlice.actions
export default webSocketSlice.reducer