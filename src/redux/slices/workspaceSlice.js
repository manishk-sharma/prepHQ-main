import { createSlice } from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
    name: "workspace",
    initialState: {
        theme: "light",
    },
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = workspaceSlice.actions;
export default workspaceSlice.reducer;
