import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    courseTypes: [],
    disciplines: [],
    semesters: [],
    papers: [],
    activityTypes: [],
    activeCourseType: {},
    activeDiscipline: {},
    activeSemester: {},
    activePaper: {},
    activeActivityType: {},
    questionConfiguration: [],
    designation: [],
    colleges: [],
    isValueUpdated: false,
    genders: [],
    maritalStatus: [],
    nationality: [],
    motherTongues: [],
    bloodGroups: []
}

const selectTagOptionsSlice = createSlice({
    name: 'selectTagOptions',
    initialState: initialState,
    reducers: {
        restSelectTagOptionsSlice: () => initialState,
        setValueUpdatePointer: (state, action) => {
            state.isValueUpdated = action.payload
        },
        setDesignations: (state, action) => {
            state.designation = action.payload
        },
        setSemester: (state, action) => {
            state.semesters = action.payload
        },
        setColleges: (state, action) => {
            state.colleges = action.payload
        },
        setCourseTypes: (state, action) => {
            state.courseTypes = action.payload
        },
        setDisciplines: (state, action) => {
            state.disciplines = action.payload
        },
        setPapers: (state, action) => {
            state.papers = action.payload
        },
        setActivityTypes: (state, action) => {
            state.activityTypes = action.payload
        },
        setQuestionConfiguration: (state, action) => {
            state.questionConfiguration = action.payload
        },
        setGenders: (state, action) => {
            state.genders = action.payload
        },
        setMaritalStatus: (state, action) => {
            state.maritalStatus = action.payload
        },
        setNationality: (state, action) => {
            state.nationality = action.payload
        },
        setMotherTongues: (state, action) => {
            state.motherTongues = action.payload
        },
        setBloodGroups: (state, action) => {
            state.bloodGroups = action.payload
        },
        setActiveDetails: (state, action) => {
            const {courseType, discipline, semester, paper, activityType} = action.payload
            if (courseType !== undefined)
                state.activeCourseType = courseType
            if (discipline !== undefined)
                state.activeDiscipline = discipline
            if (semester)
                state.activeSemester = semester
            if (paper)
                state.activePaper = paper
            if (activityType)
                state.activeActivityType = activityType
        },
        updateQuestionConfiguration(state, action) {
            const {id, value, field} = action.payload;
            const input = state.questionConfiguration.find(input => input.id === id);
            if (input) {
                input[field] = value;
            }
        }
    }
})

export const {
    restSelectTagOptionsSlice,
    setCourseTypes,
    setDisciplines,
    setPapers,
    setActivityTypes,
    setQuestionConfiguration,
    updateQuestionConfiguration,
    setSemester,
    setActiveDetails,
    setDesignations,
    setColleges,
    setGenders,
    setMaritalStatus,
    setNationality,
    setMotherTongues,
    setBloodGroups
} = selectTagOptionsSlice.actions
export default selectTagOptionsSlice.reducer
