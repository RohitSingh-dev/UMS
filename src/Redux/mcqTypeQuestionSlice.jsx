import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    mcqOptions: [
        {id: 10000000000, answer: ''},
        {id: 20000000000, answer: ''},
        {id: 30000000000, answer: ''},
        {id: 40000000000, answer: ''},
    ],
    fileUploadStatus: {
        'status': 'Pending',
        'severity': 'warning'
    },
    uploadFileName: '',

}

const mcqTypeQuestionSlice = createSlice({
    name: 'mcqTypeQuestion',
    initialState: initialState,
    reducers: {
        restQuestionBankSlice: () => initialState,
        addMcqOptions: (state) => {
            state.mcqOptions.push({id: Date.now(), answer: ''});
        },
        setMcqOptions: (state, action)=>{
            state.mcqOptions.push(action.payload)
        },
        setAllMcqOptions: (state, action)=>{
            state.mcqOptions=action.payload
        },
        removeMcqOptions: (state, action) => {
            if (state.mcqOptions.length > 2) {
                state.mcqOptions = state.mcqOptions.filter(input => input.id !== action.payload);
            }
        },
        updateValue: (state, action) => {
            const {id, value} = action.payload;
            const input = state.mcqOptions.find(input => input.id === id);
            if (input) {
                input.answer = value;
            }
        },
        clearAllMCQs: (state) => {
            state.mcqOptions.forEach((c, index) => {
                c.id = (Date.now() + index)
                c.answer = ''
            })
        }

    }
})

export const {
    restQuestionBankSlice,
    addMcqOptions,
    updateValue,
    removeMcqOptions,
    clearAllMCQs,
    setMcqOptions,
    setAllMcqOptions
} = mcqTypeQuestionSlice.actions
export default mcqTypeQuestionSlice.reducer
