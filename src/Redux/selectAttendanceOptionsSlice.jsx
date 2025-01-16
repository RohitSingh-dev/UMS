import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    course: [],
    academicSession: [],
    activeCourse: {},
    activeAcademicSession: {},
    isValueUpdated: false,
}

const selectAttendanceOptionsSlice = createSlice({
    name: 'selectAttendanceOptions',
    initialState: initialState,
    reducers: {
        restsSelectAttendanceOptionsSlice: () => initialState,
        setValueUpdatePointer: (state, action) => {
            state.isValueUpdated = action.payload
        },
        setCourse: (state, action) => {
            state.course = action.payload
        },
        setAcademicSession: (state, action) => {
            state.academicSession = action.payload
        },
        setActiveDetails: (state, action) => {
            const {course, academicSession} = action.payload
            if (course !== undefined)
                state.activeCourse = course
            if (academicSession !== undefined)
                state.activeAcademicSession = academicSession
        }
    }
})

export const {
    restsSelectAttendanceOptionsSlice,
    setCourse,
    setAcademicSession,
    setActiveDetails
} = selectAttendanceOptionsSlice.actions
export default selectAttendanceOptionsSlice.reducer