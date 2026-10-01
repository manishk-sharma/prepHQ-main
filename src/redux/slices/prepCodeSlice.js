import { createSlice } from "@reduxjs/toolkit";

const prepCodeSlice = createSlice({
    name: "prepCode",
    initialState: {
        submissionId:      null,   // submission_id from POST /submit (202 response)
        isPolling:         false,  // true while polling GET /submit/:id
        submitPollResult:  null,   // final verdict object from polling
    },
    reducers: {
        // Called right after POST /submit returns 202 with a submission_id
        submissionQueued: (state, action) => {
            state.submissionId     = action.payload;  // numeric submission_id
            state.isPolling        = true;
            state.submitPollResult = null;
        },

        // Called when polling gets a terminal status (ACCEPTED / WA / RE / etc.)
        pollResultReceived: (state, action) => {
            state.submitPollResult = action.payload;
            state.isPolling        = false;
            state.submissionId     = null;
        },

        // Called when polling is aborted (timeout / max attempts reached)
        pollingStopped: (state) => {
            state.isPolling   = false;
            state.submissionId = null;
        },

        // Called at the start of every new submit to wipe previous state
        resetSubmission: (state) => {
            state.submissionId     = null;
            state.isPolling        = false;
            state.submitPollResult = null;
        },
    },
});

export const {
    submissionQueued,
    pollResultReceived,
    pollingStopped,
    resetSubmission,
} = prepCodeSlice.actions;

export default prepCodeSlice.reducer;
