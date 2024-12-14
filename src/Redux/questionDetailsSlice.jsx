import {createSlice} from "@reduxjs/toolkit";

const initialState = {};

const questionDetailsSlice = createSlice({
    name: "questionDetails",
    initialState,
    reducers: {
        setQuestionDetails: (state, action) => {
            const { questionId, data } = action.payload;
            state[questionId] = data;
        },
        resetQuestionDetails() {
            return initialState; // Clear all stored details
        },
    },
});

export const { setQuestionDetails, resetQuestionDetails } = questionDetailsSlice.actions;

export const selectQuestionDetails = (state, questionId) => state.questionDetails[questionId];

export default questionDetailsSlice.reducer;
